import { currProfile } from "@/lib/current-profile";    
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export async function POST(req:Request) {
    
    try {
        const {name , imageUrl } = await req.json()

        const profile = await currProfile()
        if(!profile) return new NextResponse("Unauthorized " , {status: 401})

        const newServer = await db.server.create({
            data: {
                profileId : profile.id , 
                name ,
                imageUrl , 
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general" , profileId : profile.id }
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id , role: MemberRole.ADMIN}
                    ]
                }

            },
           
        })

        return NextResponse.json(newServer)

    } catch (error) {
        console.log("SERVER POST ERR ", error)
        return new NextResponse("Internal Server Error" , {status: 500})
    }
}