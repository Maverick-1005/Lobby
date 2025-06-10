import { useSocket } from "@/components/providers/socket-provider"

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    querykey: string
}

// export const useChatSocket = ({
//     addKey,
//     updateKey,
//     queryKey
// }: ChatSocketProps) => {
//     const {socket} = useSocket()
    
// }