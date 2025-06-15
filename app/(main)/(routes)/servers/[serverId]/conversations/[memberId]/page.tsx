import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: Promise<{
     serverId: string;
     memberId: string;  
   }>
}



const MemberIdPage = async ({params}: MemberIdPageProps) => {

  const profile = await currProfile();
  if (!profile) return RedirectToSignIn;

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: (await params).serverId,
    },
  });
  if(!currentMember) return redirect("/")

    const conversation = await getOrCreateConversation(currentMember.id, (await params).memberId);
  if (!conversation) {
    return redirect(`/servers/${(await params).serverId}`);
  
  }

  const {memberOne , memberTwo} = conversation;

  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;
  if (!otherMember) {
    return redirect(`/servers/${(await params).serverId}`);}
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full"> 
      <ChatHeader
        name={otherMember.profile.name}
        serverId={(await params).serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
      member={currentMember}
      name={otherMember.profile.name}
      chatId={conversation.id}
      type="conversation"
      apiUrl="/api/direct-messages"
      paramKey="conversationId"
      paramValue={conversation.id}
      socketUrl="/api/socket/direct-messages"
      socketQuery={{
        conversationId: conversation.id
      }}


      
      />
      <ChatInput
      name={otherMember.profile.name}
      type="conversation"
     
      apiUrl="/api/socket/direct-messages"
      query={{
        conversationId: conversation.id
      }}
      />
    </div>
  );
}
export default MemberIdPage;