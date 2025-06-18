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

import qs from "query-string";


// HYDRATION ERRORS KAA DHyAAn RKHNA



export const DeleteMessageModal = () => {
    
    const {isOpen , onClose , onOpen , type , data} = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && (type === 'deleteMessage')
    const {apiUrl , query } = data
    const [isLoading, setIsLoading] = useState(false)


    const onClick = async () => {
         setIsLoading(true)
         const url = qs.stringifyUrl({
            url: apiUrl || "",
            query
         })

        axios.delete(url)
        .then((res) => {
            router.refresh();            
            onClose()
        })
        .catch((err) => {
            console.log("Err while deleting message" , err)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete?
                        <br/> The message will be permanently deleted
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
                           Delete
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}