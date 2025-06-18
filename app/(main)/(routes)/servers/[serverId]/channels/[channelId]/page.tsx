
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";


 
 interface ChannelIdPageProps {
   params: Promise<{
     serverId: string;
     channelId: string;  
   }>
}
 
 
 const ChannelIdPage = async ({params} : ChannelIdPageProps) => {
    
        const profile = await currProfile();
    if (!profile) return RedirectToSignIn

    const channel = await db.channel.findUnique({
        where: {
            id: (await params).channelId,
        }
    })
    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: (await params).serverId,
        }
    })


    if(!channel || !member){
      redirect("/");
    }

    return (

    <div  className="bg-white dark:bg-[#313338] flex flex-col h-full">

      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <ChatMessages
      member={member}
      name={channel.name}
      chatId={channel.id}
      type="channel"
      apiUrl = "/api/messages"
      socketUrl="/api/socket/messages"
      socketQuery={{
        channelId: channel.id,
        serverId: channel.serverId
      }}
      paramKey="channelId"
      paramValue={channel.id}

      />

      {/* <div className="flex-1">Future messages</div> */}
      <ChatInput
      name={channel.name}
      type="channel"
      apiUrl={`/api/socket/messages`}
      query={{
        channelId: channel.id,
        serverId: channel.serverId,
      }}
      
      />
   
    </div>
  );
}

export default ChannelIdPage;