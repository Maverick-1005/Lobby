export const dynamic = 'force-dynamic';


import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request , {params} : {params: {channelId: string}}) {

    try {

        const profile = await currProfile();
        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const {searchParams} = new URL(req.url);

        const channelId = await params.channelId;

        const serverId = searchParams.get("serverId");

        if(!serverId) {
            return new NextResponse("Server ID is required", {status: 400});
        }
        if(!channelId) {
            return new NextResponse("Channel ID is required", {status: 400});
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                 members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN , MemberRole.MODERATOR]
                        }
                    }
                 }

            },
            data:{
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general" // Prevent deletion of the general channel
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
        
    } catch (error) {
        console.error("Error deleting channel:", error);

        return new NextResponse("Internal Error" , {status: 500})
        
    }
}

export async function PATCH(req: Request , {params} : {params: {channelId: string}}) {

    try {

        const profile = await currProfile();
        
        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const {name , type} = await req.json();
        const {searchParams} = new URL(req.url);

        const channelId = await params.channelId;

        const serverId = searchParams.get("serverId");
        if(name === "general") {
            return new NextResponse("Channel name cannot be 'general'", {status: 400});
        }
        if(!serverId) {
            return new NextResponse("Server ID is required", {status: 400});
        }
        if(!channelId) {
            return new NextResponse("Channel ID is required", {status: 400});
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                 members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN , MemberRole.MODERATOR]
                        }
                    }
                 }

            },
            data:{
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            name: {
                                not: "general" // Prevent updating the general channel
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
        
    } catch (error) {
        console.error("Error updating channel details", error);

        return new NextResponse("Internal Error" , {status: 500})
        
    }
}