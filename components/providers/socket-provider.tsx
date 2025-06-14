"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { set } from "react-hook-form";
import { io as ClientIO } from "socket.io-client";


type SocketContextType = {
    socket: ReturnType<typeof ClientIO> | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const [socket, setSocket] = useState<ReturnType<typeof ClientIO> | null>(null);
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        socketInstance.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected:", socketInstance.id);
        }
        );
        socketInstance.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket disconnected");
        }
        );
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect()
        }


    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}