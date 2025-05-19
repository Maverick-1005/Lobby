import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function DELETE(req: Request , {params} : {params: {memberId : string}}) {

    try {
        
        const profile = await currProfile();
        if(!profile) return new NextResponse("Unauthorised" , {status: 401} )

            const {searchParams } = new URL(req.url);
            const serverId = searchParams.get("serverId")

            if(!serverId) return new NextResponse("Server Id is missing" , {status: 403})
                if(!params.memberId) return new NextResponse("MemberId is missing" , {status: 403});

            const server = await db.server.update({
                where: {
                    id: serverId,
                    profileId: profile.id
                },
                data: {
                    members: {
                        deleteMany: {
                            id: params.memberId,
                           profileId: {
                            not: profile.id
                           }
                        }
                    }
                },
                include: {
                    members: {
                        include: {
                            profile: true
                        },
                        orderBy: {
                            role: "asc"
                        }
                    }
                }
            })
            return NextResponse.json(server , {status: 200})

    } catch (error) {
        console.log("deleting member" , error)
        return new NextResponse("Internal server error while kicing member" , {status: 500})
    }
    
}



export async function PATCH(req:Request , {params} : {params: {memberId : string}}) {
    

    try {
        const profile = await currProfile();
        if(!profile) return new NextResponse("Unauthorised" , {status: 401} )

        const {searchParams } = new URL(req.url);
        const {role} = await req.json();

        const serverId = searchParams.get("serverId")

        if(!serverId) return new NextResponse("Server Id is missing" , {status: 403})
        
            if(!params.memberId) return new NextResponse("MemberId is missing" , {status: 403});
        
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId : profile.id,

            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            },
                         
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy:{
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("Server error on changing role" , error)
        return new NextResponse("Internal Error" , {status: 500})
    }
}