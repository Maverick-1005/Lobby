import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";  
import { currProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponseServerIo
){

    if(req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const profile = await currProfilePages(req)
        const {directMessageId , conversationId} = req.query;
        const {content} = req.body


        if(!profile){
            return res.status(400).json({
                error: "Unauthorised"
            })
        }
      
        if(!conversationId){
            return res.status(400).json({
                error: "channelId missing"
            })
        }

         

              const conversation = await db.conversation.findFirst({
            where:{
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile?.id,

                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile?.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include:{
                        profile: true
                    }
                },
                memberTwo: {
                    include:{
                        profile: true
                    }
                }
            }
        })

        if(!conversation) return res.status(404).json({message: "Conversation not found"})
     
        


   
        const member = conversation.memberOne.profileId === profile?.id ? conversation.memberOne : conversation.memberTwo
        if(!member)  return res.status(404).json({
                error: "member not found"
            })


        let message = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!message || message.deleted)  return res.status(404).json({
                error: "direct message not found"
            })

        const isMessageOwner = message.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR

        const canModify = isMessageOwner || isAdmin || isModerator

        if(!canModify) return res.status(404).json({
                error: "Unauthorised to delete"
            })
        
            if(req.method === "DELETE"){

                message = await db.directMessage.update({
                    where: {
                        id: directMessageId as string
                    },
                    data: {
                        fileUrl: null,
                        content: "This message has been deleted",
                        deleted: true
                    },
                    include: {
                        member: {
                            include: {
                                profile: true
                            }
                        }
                    }
                })
            }
            if(req.method === "PATCH"){
                if(!isMessageOwner) return res.status(401).json({error: "Only msg owner can edit"})

                message = await db.directMessage.update({
                    where: {
                        id: directMessageId as string
                    },
                    data: {
                        content
                    },
                    include: {
                        member: {
                            include: {
                                profile: true
                            }
                        }
                    }
                })
            }

            const updateKey = `chat:${conversation.id}:messages:update`

            res?.socket?.server?.io?.emit(updateKey , message);
            return res.status(200).json(message)

        
    } catch (error) {
        console.log("[MESSAGE_ID]" , error)
    }





}