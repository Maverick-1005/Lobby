"use client";

import { Check, Copy, RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";






// HYDRATION ERRORS KAA DHyAAn RKHNA

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}


export const MembersModal = () => {
    
    const {isOpen , onClose , onOpen , type , data} = useModal()

    const isModalOpen = isOpen && (type === 'members')
    const {server} = data as {server: ServerWithMembersWithProfiles};



    const [isLoading, setIsLoading] = useState(false)



    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black  overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                 className="text-center text-zinc-500"
                >
                    {server?.members?.length} Members
                </DialogDescription>
                </DialogHeader>
                
               <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                        </div>
                    ))}
               </ScrollArea>
               

            </DialogContent>
        </Dialog>
    )
}