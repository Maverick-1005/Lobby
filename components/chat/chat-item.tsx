"use client"

import { Member, Profile } from "@prisma/client"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl?: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

export const ChatItem = ({
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
}: ChatItemProps) => {
    const isAdmin = currentMember.role === "ADMIN";
    const isModerator = currentMember.role === "MODERATOR";
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileUrl?.toLowerCase().endsWith("pdf");
    const isImage = !isPDF && fileUrl;

    return (
        <div className={cn(
            "group relative flex items-center hover:bg-black/5 p-4 transition w-full",
            deleted && "italic text-zinc-500"
        )}>
            <div className="group flex gap-x-2 items-start w-full">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="text-sm font-semibold flex items-center gap-x-1">
                                {member.profile.name}
                                <ActionTooltip label={member.role}>
                                    {roleIconMap[member.role]}
                                </ActionTooltip>
                            </p>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a 
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <img
                                src={fileUrl}
                                alt={content}
                                className="object-cover"
                            />
                        </a>
                    )}
                    {!fileUrl && !deleted && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "text-xs text-zinc-500 dark:text-zinc-400 italic"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {deleted && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                            This message was deleted
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}