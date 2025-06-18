"use client";
import axios from "axios"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Loader2, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";




// HYDRATION ERRORS KAA DHyAAn RKHNA


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required"
    })

})

export const InitialModal = () => {
    
    const {isOpen , onClose , type} = useModal()
    // console.log("Initial Modal ke andar hoon")
    // console.log("isOpen = " , isOpen)
    // console.log("onclose = " , onClose)
    // console.log("type = " , type)
    const router = useRouter()

    const isModalOpen = isOpen && (type === 'createServer')

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

        await axios.post("/api/servers" , values)
        .then(
            (res) => {
                //    console.log("iske baad kaa kuch bhi")
                //     console.log("server id " , res.data?.id)
                //     console.log("channel id " , res.data?.data?.chanels[0].id)

                console.log("res after creating server initial model" , res)
                 onClose()
                form.reset(); // ye padhlena thoda
                
                router.refresh()
               
                
            }
        )
        .catch((err) => {
            console.log("err while creating server" , err)
        })
    }
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("")
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        console.log("file", selectedFile)
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile))

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const res = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("res aaya ye backend se ", res)

            setImageUrl(res.data.url);
            form.setValue("imageUrl", res.data.url); // **Set URL in Form**
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleOnClose = () => {
        form.reset()
        onClose()
    }

    return (
        <div>
            <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription>
                        Give your server a personality with a name and an image. You can alsways change it later.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ }) => (
                                        <FormItem>

                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        id="avatar"
                                                        accept="image/*"
                                                        disabled={isLoading || uploading}
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="avatar">


                                                        {
                                                            !previewUrl && (<div className="cursor-pointer"><CameraAltIcon /><span className="text-sm"> Upload </span></div>)
                                                        } {
                                                            uploading && (
                                                                <Loader2 className="h-7 w-7 animate-spin"/>
                                                            )
                                                        }
                                                        
                                                        {
                                                            previewUrl && !uploading && (<div className="cursor-pointer">
                                                            <img className="rounded-full  relative h-28 w-28 object-cover" src={previewUrl}/>
                                                            <div className="absolute bg-rose-500 p-1 rounded-full shadow-sm top-0 right-2" onClick={() => {
                                                                setPreviewUrl("");
                                                            }}> <X className="h-4 w-4 text-white"></X> </div>
                                                            </div>)
                                                        }

                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500">
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                            focus-visibke:ring-0 text-black focus-visible:ring-offset-0
                                            "
                                                placeholder="Enter Server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
               
        </div>
   )
}