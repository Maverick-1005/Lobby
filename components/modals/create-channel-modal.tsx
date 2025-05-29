"use client";
import axios from "axios"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useModal } from "@/hooks/use-modal-store";


import {
    Select ,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { ChannelType } from "@prisma/client";
import { useParams } from "next/navigation";
import queryString from "query-string";


// HYDRATION ERRORS KAA DHyAAn RKHNA


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general" , {
            message: "Channel name cannot be 'general' "
        }
    ),
    type: z.nativeEnum(ChannelType)
    
})

export const CreateChannelModal = () => {
    
    const {isOpen , onClose , type , data} = useModal()

    // const router = useRouter()
    const params = useParams()

    const isModalOpen = isOpen && (type === 'createChannel')

    const {channelType} = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType || ChannelType.TEXT
          
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

        const url = queryString.stringifyUrl({
            url: "/api/channels",
            query: {
                serverId: params?.serverId
            }
        })

        await axios.post(url , values)
        .then(
            (res) => {
                console.log("res after creating channel" , res)
                form.reset(); // ye padhlena thoda
                // router.refresh()
                onClose()
                
            }
        )
        .catch((err) => {
            console.log("err while creating channel" , err)
        })
    }

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        }
        else {
            form.setValue("type", ChannelType.TEXT);
        }
    } , [channelType, form])
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("")
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleOnClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Create Channel
                    </DialogTitle>
                    
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div className="space-y-8 px-6">
                           
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500">
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                            focus-visibke:ring-0 text-black focus-visible:ring-offset-0
                                            "
                                                placeholder="Enter Channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Channel Type</FormLabel>
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select a channel type"/>
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((item) => (
                                                    <SelectItem
                                                    key={item}
                                                    value={item}
                                                    className="capitalize"
                                                    
                                                    >
                                                        {item.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}