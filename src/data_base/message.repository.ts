import prisma from './models/messages';
import { Messages } from '@prisma/client';


type createMessage = Pick<Messages, "content" | "chatId" | "authorId">;


// export const createMessage = async (msg: createMessage) => {
//   return await prisma.create({
//     data: {
//       content: msg.content,
//       chatId: msg.chatId,
//       authorId: msg.authorId
//     },
//   });
// };

export const createMessage = async (msg: createMessage) => {
  const createdMessage = await prisma.create({
    data: {
      content: msg.content,
      chatId: msg.chatId,
      authorId: msg.authorId
    },
  });

  return createdMessage;
};