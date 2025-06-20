"use client";




import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import React, { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";


import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";




// HYDRATION ERRORS KAA DHyAAn RKHNA



export const LeaveServerModal = () => {
    
    const {isOpen , onClose , onOpen , type , data} = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && (type === 'leaveServer')
    const {server} = data
    const [isLoading, setIsLoading] = useState(false)


    const onClick = async () => {
         setIsLoading(true)
        axios.patch(`/api/servers/${server?.id}/leave`)
        .then((res) => {
           
            router.refresh();
            router.push("/")
            



            onClose()
        })
        .catch((err) => {
            console.log("Err while leaving server" , err)
        })
        .finally(() => setIsLoading(false))
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to leave <span className="font-semibold text-rose-600">{server?.name}</span>?
                    </DialogDescription>
                   
                </DialogHeader >
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">

                        <Button 
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        variant="redwala" 
                        onClick={onClick}                       >
                            Leave
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}