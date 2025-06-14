import { NextApiRequest } from "next";
import {NextApiResponseServerIo} from "@/types"
import { currProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest ,  res: NextApiResponseServerIo) {
    
    if(req.method !== "POST") {
       res.status(405).json({error : "Method not allowed"})
    }

    try {
        const profile = await currProfilePages(req)
        const {content , fileUrl} = req.body;
        const {conversationId} = req.query;

        if(!profile) res.status(401).json({error: "Unauthorised"})
        if(!conversationId) res.status(401).json({error: "conversationId missing"})
        // if(!serverId) res.status(401).json({error: "Server Id missing"})
        if(!content) res.status(401).json({error: "Empty msg"})
            
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

        if(!member){
            return res.status(404).json({message: "Member not found"});
        }


        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey , message)       
        return res.status(200).json(message)




    } catch (error) {
        console.log(" DIRECT MESSAGES POST ERROR" , error)
        return res.status(500).json({msg: "Internal error at msges"})
    }
}