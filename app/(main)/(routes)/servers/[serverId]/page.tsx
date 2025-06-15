import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
    params: Promise<{
        serverId: string;
    }>
}


const ServerIdPage = async ({
    params
} : ServerIdPageProps) => {
    const profile = await currProfile();

   if(!profile) return RedirectToSignIn

   const server = await db.server.findUnique({
    where: {
        id: (await params).serverId,
        members: {
            some: {
                profileId: profile.id
            }
        }
    },
    include: {
        channels: {
            where: {
                name: "general"
            },
            orderBy: {
                createdAt: "asc"
            }
        }
    }
   })

   const initialChannel = server?.channels[0];

   if(initialChannel?.name !== "general")  return null;

    return (
       redirect(`/servers/${(await params).serverId}/channels/${initialChannel?.id}`)
    )
}

export default ServerIdPage