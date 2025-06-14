import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function DELETE(req:Request , {params}:{params: 
    Promise<{
    serverId: string
}>
}) {
    try {

        const {serverId} = await params;
        const profile = await currProfile()
        if(!profile) return new NextResponse("Unauthorised" , {status: 401})
        
        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id
            }    
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("Server error while deleting server" , error)
        return new NextResponse("Internal Error" , {status: 500})
    }
}
export async function PATCH(req:Request , {params}:{params: Promise<{
    serverId: string
}>}) {
    try {

        const {serverId} = await params;
        const {name , imageUrl} = await req.json()
        const profile = await currProfile()
        if(!profile) return new NextResponse("Unauthorised" , {status: 401})
        
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data:{
                name,
                imageUrl
            }
        })
        return NextResponse.json(server)

    } catch (error) {
        console.log("Server error" , error)
        return new NextResponse("Internal Error" , {status: 500})
    }
}