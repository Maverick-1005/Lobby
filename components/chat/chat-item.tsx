"use client"

import * as z from "zod";
import axios from "axios";
import qs from "query-string"
import {useForm} from "react-hook-form"


import { Member, Profile } from "@prisma/client"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

import {
    Form ,
    FormControl , 
    FormField , 
    FormItem
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

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

const formSchema = z.object({
    content: z.string().min(1)
})


export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {




    const [isEditing, setIsEditing] = useState(false)
    const {onOpen} = useModal()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    useEffect(()=> {

        const handleKeyDown = (event: any) => {
            if(event.key === "Escape" || event.keycode === 27){
                setIsEditing(false)
            }
        }

        window.addEventListener('keydown' , handleKeyDown)

        return () => window.removeEventListener('keydown' , handleKeyDown)
    } , []) 
    
    const isLoading = form.formState.isSubmitting

    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("values while editing msg " , values)

        try {

            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery

            })

            await axios.patch(url, values)
            form.reset()
            setIsEditing(false);
            router.refresh()

        } catch (error) {
            console.log("")
        }
    }

    useEffect(()=> {
        form.reset({
            content: content,
        })
    }, [content])


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
            <div className="group flex gap-x-2 items-start w-full ">
                <div className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="text-sm text-white not-italic font-semibold flex items-center gap-x-1">
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
                    {fileUrl && isPDF && (
                        
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-backrgound/10">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                            <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}
                    
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "text-xs text-zinc-500 dark:text-zinc-400 itali mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {
                        !fileUrl && isEditing && (
                            <Form
                            {...form}
                            >
                                <form 
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                    disabled = {isLoading}
                                                    className="p-2 bg-zinc-200/90
                                                     dark:bg-zinc-700/75 border-none border-0 
                                                    focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                    placeholder="Edited message"
                                                    {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <Button 
                                     disabled = {isLoading}
                                     size="sm" variant="primary">
                                        Save
                                        </Button>
                                    
                                </form>
                                <span className="text-[10px] mt-1 text-zinc-400">
                                        Press escape to cancel , enter to save
                                    </span>

                            </Form>
                        )
                    }
                    {/* {deleted && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                            This message was deleted
                        </p>
                    )} */}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border-rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit
                            onClick={() => setIsEditing(true)}
                            
                            className="curson-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                        </ActionTooltip>
                    )}
                     <ActionTooltip label="Delete">
                            <Trash 
                            onClick={() => {
                                onOpen("deleteMessage" , {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery
                                })
                            }}
                            
                            className="curson-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
                        </ActionTooltip>
                </div>
            )}
        </div>
    )
}