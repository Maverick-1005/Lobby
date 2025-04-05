import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(req:Request ,  context: { params: { serverId: string } }) {
    try {
        const { serverId } = await context.params; 
        console.log("backend mein serverId" , serverId)


        const profile = await currProfile()

        if(!profile) return new NextResponse("Unauthorized " , {status: 401})

        if(!serverId) return new NextResponse("Server id not found" , {status: 404})
        
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id 
            },
            data: {
                inviteCode: uuidv4()
            }
        })
        console.log("updated server " , server)
        return NextResponse.json(server)
        
    } catch (error) {
        console.log("server id " , error)
        return new NextResponse("internal server err while generating new link" , {status: 500})
    }
}