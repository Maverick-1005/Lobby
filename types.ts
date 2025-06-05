import {Server as NetServer , Socket} from "net";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";


import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile})[];
}

export type NextApiRequestServerIo = NextApiRequest & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};