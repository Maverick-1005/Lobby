import qs from "query-string"
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query"
import { useSocket } from "@/components/providers/socket-provider"

interface ChatQueryProps {
    queryKey: string; 
    apiUrl: string,
    paramKey: "channelId" | "conversationId";
    paramValue: string
}

export const useChatQuery = (
    { 
        queryKey, 
        apiUrl, 
        paramKey, 
        paramValue 
    }    : ChatQueryProps) => {
    const {isConnected } = useSocket()

    const fetchMessages = async ({ pageParam }: { pageParam?: unknown }) => {
        console.log("current cursor" , pageParam)
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam as string | undefined,
                [paramKey]: paramValue as string | undefined
            }
        }, { skipNull: true })

        const res = await fetch(url);
        return res.json()
    }

    const {
        data, 
        fetchNextPage,
        hasNextPage, 
        isFetchingNextPage,
        status
    } = useInfiniteQuery<any, Error>({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: null,
    });


    return {
        data , 
        fetchNextPage ,
        hasNextPage , 
        isFetchingNextPage, 
        status
    }

}  