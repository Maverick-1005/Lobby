"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function InviteNotification({ message, redirectUrl }: { message: string; redirectUrl: string }) {
  const router = useRouter();

  useEffect(() => {
    toast.success(message, { position: "top-right" });

    setTimeout(() => {
      router.push(redirectUrl);
    }, 1000);
  }, [message, redirectUrl, router]);

  return <ToastContainer />;
}
