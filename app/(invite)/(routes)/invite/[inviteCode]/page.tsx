import InviteNotification from "@/components/invite/InviteNotification";
import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";


interface InviteCodePageParams {
    params: Promise<{
        inviteCode: string
    }>
}




export default async function InviteCodePage({
    params
}: InviteCodePageParams) {

    const profile = await currProfile();
    console.log("HELLO AAAWAJ AARHA HAI???")
    // const {redirectToSignIn} = await auth()
    console.log("profile is " , profile)
    if(!profile){
        console.log("redirect 1 ")
        return redirect("/")
    }
    const {inviteCode} = await params
    if(!inviteCode){
      console.log("redirect 2");
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
    
    return null

}
