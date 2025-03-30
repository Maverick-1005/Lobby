"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "../modals/create-server-modal";

export const ModalProvider = () => {

    const [isMounted , setIsMounted] = useState(false)
    useEffect (() => {
        setIsMounted(true);
    } , [])

    if(!isMounted) return null

    // this prevents the modal to be rendred on the server side preventing hydration errors ....READ MORE

   
    return (
        <>
          <CreateServerModal/>

        </>
    )
}