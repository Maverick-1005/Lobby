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
        const {serverId , channelId} = req.query;

        if(!profile) res.status(401).json({error: "Unauthorised"})
        if(!channelId) res.status(401).json({error: "ChannelId missing"})
        if(!serverId) res.status(401).json({error: "Server Id missing"})
        if(!content) res.status(401).json({error: "Empty msg"})
        
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile?.id
                    }
                }
            },
            include: {
                members: true
            }
        })

        if(!server) return res.status(404).json({message: "Server not found"})
        
            const channel = await db.channel.findFirst({
                where: {
                    id: channelId as string,
                    serverId: serverId as string
                }
            })
        if(!channel) return res.status(404).json({message: "Channel not found"})
        
        const member = server.members.find((member) => member.profileId === profile?.id)

        if(!member){
            return res.status(404).json({message: "Member not found"});
        }


        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
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

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey , message)       
        return res.status(200).json(message)




    } catch (error) {
        console.log("MESSAGES POST ERROR" , error)
        return res.status(500).json({msg: "Internal error at msges"})
    }
}