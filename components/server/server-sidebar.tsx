import { currProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { ScrollArea } from "../ui/scroll-area"
import { Hash, Mic, Shield, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "../ui/separator"



import { ServerHeader } from "./server-header"
import { ServerSearch } from "./server-search"
import { ServerSection } from "./server-section"
import { ServerChannel } from "./server-channel"
import { ServerMember } from "./server-member"
import { channel } from "diagnostics_channel"


interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />

}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {

    const profile = await currProfile()



    if (!profile) {
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    const members = server?.members.filter((member) => member.profileId != profile.id)

    if (!server) return redirect("/")

    const role = server.members.find((member) => member.profileId === profile.id)?.role;


    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },

                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }

                        ]}
                    />
                </div>

                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                <div className="space-y-[2px]">
                    {textChannels?.length && (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                label="Text Channels"
                                channelType={ChannelType.TEXT}
                                server={server}
                                role={role}
                            />

                            {textChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                            ))}
                        </div>
                    )}
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                <div className="space-y-[2px]">

                    {/* {
                    audioChannels?.length && } */}
                    {
                   (
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                label="Audio Channels"
                                channelType={ChannelType.AUDIO}
                                server={server}
                                role={role}

                            />

                            {audioChannels?.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                            ))}
                        </div>
                    )
                    }
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

                <div className="space-y-[2px]">

                    
                        <div className="mb-2">
                            <ServerSection
                                sectionType="channels"
                                label="Video Channels"
                                channelType={ChannelType.VIDEO}
                                role={role}

                            />

                            {videoChannels?.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} server={server} role={role} />
                            ))}
                        </div>
                    
                </div>

                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                <div className="space-y-[2px]">

                     
                        <div className="mb-2">
                            <ServerSection
                                sectionType="members"
                                label="Members"
                                server={server}
                                role={role}

                            />
                            {members?.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}

                        </div>
                    
                </div>
            </ScrollArea>
        </div>
    )
}