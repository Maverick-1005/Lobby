"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { io as ClientIO } from "socket.io-client";

import { useUser } from "@clerk/nextjs";

type SocketContextType = {
    socket: ReturnType<typeof ClientIO> | null;
    isConnected: boolean;
    onlineUserIds: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    onlineUserIds: new Set()
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: {
    children: React.ReactNode;
}) => {

    const { user, isLoaded } = useUser();

    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

    const [socket, setSocket] = useState<ReturnType<typeof ClientIO> | null>(null);
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!isLoaded || !user) return;

        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            query: {
                userId: user.id, // Clerk user ID passed to backend
            },
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


    }, [user?.id])

     // 👉 2. Setup listeners for online status
  useEffect(() => {
    if (!socket) return;

    socket.on("online-users", (userIds: string[]) => {
      setOnlineUserIds(new Set(userIds));
    });

    socket.on("user-online", (userId: string) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });

    socket.on("user-offline", (userId: string) => {
      setOnlineUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, isConnected  , onlineUserIds}}>
            {children}
        </SocketContext.Provider>
    );
}