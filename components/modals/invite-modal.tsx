"use client";

import { Check, Copy, RefreshCcw } from "lucide-react";



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";


import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";




// HYDRATION ERRORS KAA DHyAAn RKHNA



export const InviteModal = () => {
    
    const {isOpen , onClose , onOpen , type , data} = useModal()
    const origin = useOrigin();
    // const router = useRouter()

    const isModalOpen = isOpen && (type === 'invite')
    const {server} = data
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy= () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false)
        } , 1000);
    }

    const onNew = async () => {
        console.log("hello bhai")
        try {
            console.log("yahan bhi")
            setIsLoading(true)
            console.log("server id hai kya ", server?.id)
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite" , {server: res.data}) 
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.log("err " , error)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Invite Friends
                    </DialogTitle>
                   
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite Link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input 
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" readOnly value={inviteUrl}/>
                        <Button onClick={onCopy} size="icon">
                           {
                            copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
                           }
                            
                        </Button>

                    </div>
                    <Button
                    disabled={isLoading}
                    onClick={onNew}
                     variant="link"
                     size="sm"
                     className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link 
                        <RefreshCcw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}