import {currentUser , auth} from "@clerk/nextjs/server"
import { db } from "./db" 

export const currProfile = async () => {
    const { userId } = await auth()

    if(!userId){
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile


}