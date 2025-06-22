"use client"

import { useEffect, useState } from "react";
import { useSocket } from "./providers/socket-provider" 
import {Badge} from "@/components/ui/badge";

interface OnlineIndicatorProps {
    memberId: string
}

export const OnlineIndicator = ({memberId}: OnlineIndicatorProps) => {
    const { isConnected , onlineUserIds} = useSocket();

     const [isOnline, setisOnline] = useState(false)
     console.log("online users " , onlineUserIds)
     console.log("checking member " , memberId)

     useEffect(() => {
        setisOnline(onlineUserIds.has(memberId))
     } , [onlineUserIds])

    if(!isConnected || !isOnline) {

    return (
            <Badge   
                variant={"outline"}      
                className="bg-yellow-600 text-white border-none"
            >
                Offline
            </Badge>
    );
}
else if(isOnline){
    return (

            <Badge
                variant={"outline"}         
                className="bg-emerald-600 text-white border-none"
            >
                Online
            </Badge>
    );
}

};  