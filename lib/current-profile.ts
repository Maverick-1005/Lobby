import {currentUser , auth} from "@clerk/nextjs/server"
import { db } from "./db" 

export const currProfile = async () => {
    const { userId } = await auth()
    console.log("userID in cur profile" , userId)
    if(!userId){
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });
    console.log(" profile ind curr profile " , profile)
    return profile


}