import InviteNotification from "@/components/invite/InviteNotification";
import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

export default async function InviteCodePage({
    params
}: InviteCodePageProps) {
    const profile = await currProfile();
    
    if(!profile){
        return redirect("/")
    }

    const {inviteCode} = params;
    
    if(!inviteCode){
        return redirect("/");  
    } 

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        return <InviteNotification message="You are already in the server!" redirectUrl={`/servers/${existingServer.id}`} />;
    }

    const server = await db.server.update({
        where: {
            inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })
   
    if (server) {
        return <InviteNotification message="Server Joined Successfully!" redirectUrl={`/servers/${server.id}`} />;
    }
    
    return null;
}
