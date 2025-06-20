import { useSocket } from "@/components/providers/socket-provider"
import { Member, Profile } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { Message } from "@prisma/client"
import { useEffect } from "react"

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

type QueryData = {
    pages: {
        items: MessageWithMemberWithProfile[]
    }[]
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket()

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: QueryData) => {
                if (!oldData || !oldData.pages) {
                    return oldData;
                }

                const newData = oldData.pages.map((page) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                });

                return {
                    ...oldData,
                    pages: newData
                }
            });
        });

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: QueryData) => {
                if (!oldData || !oldData.pages) {
                    return oldData;
                }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [message, ...newData[0].items]
                };

                return {
                    ...oldData,
                    pages: newData
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey)
        }
    }, [queryClient , queryKey , addKey , socket , updateKey])

}