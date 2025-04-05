import { ServerSidebar } from "@/components/server/server-sidebar"
import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import {redirect} from "next/navigation"
const ServerIdLayout = async({children , params}: {children : React.ReactNode , params: Promise<{serverId : string}>}) => {


    const profile = await currProfile()


    const {redirectToSignIn} = await auth()

    if(!profile){
        return redirectToSignIn()
    }
    // const { serverId } = await params
    const serverId = (await params).serverId;


    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id  // only who is memeber of the server can load the server
                }
            }
             
        }
    })


    if(!server) return redirect("/");

    return (
       <div className="h-full">
        <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
           <ServerSidebar serverId = {serverId}/>
        </div>
        <main className="h-full md:pl-60">
            {children}
        </main>
       </div> 
    )

}

export default ServerIdLayout