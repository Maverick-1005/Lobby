import { Server as NetServer } from "http"
import { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

import { NextApiResponseServerIo } from "@/types"

const onlineUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>


export const config = {
    api: {
        bodyParser: false,
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (!res.socket.server.io) {
        const path = "/api/socket/io";
        const httpServer: NetServer = res.socket.server as unknown as NetServer;
        const io = new ServerIO(httpServer, {
            path,
            addTrailingSlash: false,
        })
        res.socket.server.io = io
        io.on("connection", (socket) => {
            const userId = socket.handshake.query.userId as string;

            if (!userId) return;

            // Store socketId under userId
            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }
            onlineUsers.get(userId)!.add(socket.id);

            // Broadcast to others that this user is online
            socket.broadcast.emit("user-online", userId);

            // Send current list of online users to the connected user
            socket.emit("online-users", Array.from(onlineUsers.keys()));

            // ✅ Handle disconnection
            socket.on("disconnect", () => {
                const sockets = onlineUsers.get(userId);
                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        onlineUsers.delete(userId);
                        socket.broadcast.emit("user-offline", userId);
                    }
                }
            });
        });
    }
    res.end()
}