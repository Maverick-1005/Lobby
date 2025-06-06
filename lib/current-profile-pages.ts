import {getAuth} from "@clerk/nextjs/server"
import { db } from "./db" 
import { NextApiRequest } from "next"

export const currProfilePages = async (req: NextApiRequest) => {
    const { userId } = await getAuth(req)
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