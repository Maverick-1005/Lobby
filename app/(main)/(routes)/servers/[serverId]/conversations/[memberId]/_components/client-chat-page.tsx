// app/servers/[serverId]/members/[memberId]/_components/client-chat-page.tsx


import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
// import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile } from "@prisma/client";

interface Props {
  otherMember: Member & { profile: Profile };
  currentMember: Member;
  serverId: string;
  conversationId: string;
}

const ClientChatPage = ({
  otherMember,
  currentMember,
  serverId,
  conversationId,
}: Props) => {
  // const { onlineUserIds } = useSocket();
  // const isOnline = onlineUserIds.has(otherMember.id);

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        // isOnline={isOnline}
      />
      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversationId}
        type="conversation"
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversationId}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversationId,
        }}
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversationId,
        }}
      />
    </div>
  );
};

export default ClientChatPage;
