import prisma from './models/chats';
import { Chats } from '@prisma/client';


type createChat = Pick<Chats, "idUser1" | "idUser2">;

export const createChat = async (chat: createChat) => {

  return await prisma.create({
    data: {
      idUser1: chat.idUser1,
      idUser2: chat.idUser2
    },
  });

}

export const getChatId = async (idUser1: number, idUser2: number) => {
  const chat = await prisma.findFirst({
    where: {
      OR: [
        {
          idUser1: idUser1,
          idUser2: idUser2
        },
        {
          idUser1: idUser2,
          idUser2: idUser1
        }
      ]
    }
  });
  if (!chat) {
    throw new Error('Chat not found');
  }
  return chat.id;
}

export const thisChatExist = async (idUser1: number, idUser2: number) => {
  const chat = await prisma.findFirst({
    where: {
      OR: [
        {
          idUser1: idUser1,
          idUser2: idUser2
        },
        {
          idUser1: idUser2,
          idUser2: idUser1
        }
      ]
    }
  });

  if (chat) {
    return true;
  }
  return false;
}


export const getChatMessages = async (chatId: number) => {
  const chat = await prisma.findUnique({
    where: { id: chatId },
    include: { messages: true }
  });
  return chat?.messages;
};