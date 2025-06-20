"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import React from "react";

interface ServerChannelProps {
    channel: Channel;
    server: Server
    role?: MemberRole

}
const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}
export const ServerChannel = ({channel , server , role} : ServerChannelProps) => {

    const params = useParams();
    const router = useRouter();

    const {onOpen} = useModal();

    const Icon = iconMap[channel.type];

    const onClick = ()=> {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
    }
    const onAction = (e: React.MouseEvent , action: ModalType) => {
         e.stopPropagation();
        onOpen(action, {server , channel});
    }
    return (
        <button 
            onClick={onClick}
            className={cn("group flex items-center gap-x-2 px-2 py-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-")}>
               
         <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"/>
            <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" , params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white" )}>
                {channel.name}
            </p>

            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <ActionTooltip label="Edit">
                    <Edit
                    onClick={(e) => onAction(e , "editChannel" )}
                     className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400
                    dark:hover:text-zinc-300 transition "
                    />
                </ActionTooltip>
            )}
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <ActionTooltip label="Delete">
                    <Trash
                   onClick={(e) => onAction(e , "deleteChannel" )}       
                    className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-40
                    dark:hover:text-zinc-300 transition "
                    />
                </ActionTooltip>
            )}

            {
                channel.name === "general" && (
                    <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
                )
            }
        </button>
    )
}