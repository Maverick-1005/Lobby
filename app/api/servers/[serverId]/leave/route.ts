import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params} : {params: {serverId: string}}
){
    
    try {
        const profile = await currProfile()
        if(!profile) return new NextResponse("Unauthorised" , {status: 401});

        if(!params.serverId) return new NextResponse("Server ID missing" , {status: 400})

        const serverId = params?.serverId

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId : profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

          return NextResponse.json(server);
    } catch (error) {
        console.log("Leave Server Error on server side",error)
    }

}