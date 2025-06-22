

import { Hash } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";
import { UserAvatar } from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { OnlineIndicator } from "../online-status";



interface ChatHeaderProps {
  name: string;
  serverId: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  memberId : string
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
  memberId
}: ChatHeaderProps) => {


  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {
        type === "conversation" && (
          <UserAvatar src={imageUrl} className="h-8 w-8 mr-2" />
        )
      }
      <div>
        <p className="font-semibold text-md text-black dark:text-white">
          {name}
        </p>
      {type==="conversation" && <OnlineIndicator memberId={memberId}/>}
      </div>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
}