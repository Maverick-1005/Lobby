"use client";
import axios from "axios"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Paperclip, X } from "lucide-react";
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



import qs from "query-string"
// HYDRATION ERRORS KAA DHyAAn RKHNA


const formSchema = z.object({

    fileUrl: z.string().min(1, {
        message: "file is required"
    })

})

export const MessageFilelModal = () => {

    const { isOpen, onClose, type, data } = useModal()
    const {apiUrl , query} = data
    // console.log("Initial Modal ke andar hoon")
    // console.log("isOpen = " , isOpen)
    // console.log("onclose = " , onClose)
    // console.log("type = " , type)
    const router = useRouter()



    const isModalOpen = isOpen && (type === 'messageFile')

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {

            fileUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        const url = qs.stringifyUrl({
            url: apiUrl || "",
            query

        })
        await axios.post(url, {
            ...values,
            content: values.fileUrl  // isko dekhlena
        })
            .then(
                (res) => {
                    console.log("res after creating server", res)
                    form.reset(); // ye padhlena thoda
                    
                    router.refresh()
                    handleOnClose()

                }
            )
            .catch((err) => {
                console.log("err while creating server", err)
            })
    }
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("")
    const [fileUrl, setfileUrl] = useState<string | null>(null);

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

            setfileUrl(res.data.url);
            form.setValue("fileUrl", res.data.url); // **Set URL in Form**
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
            <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center">
                            Add an attachment
                        </DialogTitle>
                        <DialogDescription>
                            Attach a file along with message
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8">
                            <div className="space-y-8 px-6">
                                <div className="flex items-center justify-center text-center">
                                    <FormField
                                        control={form.control}
                                        name="fileUrl"
                                        render={({ }) => (
                                            <FormItem>

                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            id="attachment"
                                                            accept="/*"
                                                            disabled={isLoading || uploading}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                        <label htmlFor="attachment">
                                                            {
                                                                previewUrl ?

                                                                    <div className="cursor-pointer">
                                                                        {
                                                                            <>
                                                                                {file?.type.startsWith("image/") && (
                                                                                    <img src={previewUrl} alt="preview" className="rounded-full  relative h-28 w-28 object-cover" />
                                                                                )}

                                                                                {file?.type === "application/pdf" && (
                                                                                    <iframe src={previewUrl} className=" relative h-28 w-28 object-cover" />

                                                                                )}

                                                                                {file?.type.startsWith("video/") && (
                                                                                    <video src={previewUrl} className="rounded-full  relative h-28 w-28 object-cover"/>
                                                                                )}
                                                                            </>
                                                                        }
                                                                        {/* <img className="rounded-full  relative h-28 w-28 object-cover" src={previewUrl} /> */}
                                                                        <div className="absolute bg-rose-500 p-1 rounded-full shadow-sm top-0 right-2" onClick={() => {
                                                                            setPreviewUrl("");
                                                                        }}> <X className="h-4 w-4 text-white"></X> </div>
                                                                    </div>
                                                                    :

                                                                    <div className="cursor-pointer"><Paperclip /><span className="text-sm"> Upload </span></div>

                                                            }
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                            </div>
                            <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Send
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>

                </DialogContent>
            </Dialog>

        </div>
    )
}