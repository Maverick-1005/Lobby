import { initialProfile } from "@/lib/initial-profile"
import { redirect } from 'next/navigation'
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";
async function SetupPage() {

    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some : {
                    profileId : profile.id
                }
            }
        } 
    })

    if(server){
        console.log("redirect hogya")
        return redirect(`/servers/${server.id}`);
    } 
  return (
    <div><InitialModal/></div>
  )
}

export default SetupPage