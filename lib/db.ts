import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db

// to prevernt everytime creation of new PrismaClient during hotreload
// as gloablThis is not affected by hotreloaded