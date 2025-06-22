import { db } from "./db";  

export const getOrCreateConversation = async(memberOneId: string, memberTwoId: string) => {


  // check whether the members exist or not
  const memberOne = await db.member.findFirst({
    where: {
      id: memberOneId
    }
  })
  const memberTwo = await db.member.findFirst({
    where: {
      id: memberTwoId
    }
  })
  if(!memberOne || !memberTwo) return null;


  const existingConversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);
  if (existingConversation) {
    return existingConversation;
  }
  const newConversation = await createNewConversation(memberOneId, memberTwoId);
  if (!newConversation) {
    throw new Error("Failed to create a new conversation");
  }
  return newConversation;
}

const findConversation = async(memberOneId: string, memberTwoId: string) => {
try {
      const conversation = await db.conversation.findFirst({
        where: {
          AND: [
            {
              memberOneId: memberTwoId,
              memberTwoId: memberOneId,
            },
          ],
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            },
          },
          memberTwo: {
            include: {
              profile: true,
            },
          },
        },
      });
      return conversation;
    
} catch (error) {
    return null;
}}

const createNewConversation = async(memberOneId: string, memberTwoId: string) => {
    
try {
      const conversation = await db.conversation.create({
        data: {
          memberOneId,
          memberTwoId,
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            },
          },
          memberTwo: {
            include: {
              profile: true,
            },
          },
        },
      });
      return conversation;
    
} catch (error) {
    return null;
}

}