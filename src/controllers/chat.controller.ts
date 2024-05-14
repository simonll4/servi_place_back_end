/* eslint-disable no-useless-catch */
import { getAuthorIdByArticleId } from '../data_base/articles.repository';
import { thisChatExist, createChat, getChatId, getChatMessages } from '../data_base/chats.repository';
import { createMessage } from '../data_base/message.repository';

export const chatMessage = async (userId1: string, userId2: string, msg: string) => {
  try {

    // si el chat no existe lo creamos
    if (!await thisChatExist(Number(userId1), Number(userId2))) {
      createChat({ idUser1: Number(userId1), idUser2: Number(userId2) });
    }

    // obtenemos el chat por el id de los usuarios
    const chat = await getChatId(Number(userId1), Number(userId2));
    await createMessage({ content: msg, chatId: chat, authorId: Number(userId1) });

  } catch (error) {
    throw error;
  }
};

export const chatHistory = async (userId1: number, userId2: number) => {
  try {
    if (!await thisChatExist(userId1, userId2)) {
      createChat({ idUser1: userId1, idUser2: userId2 });
      
      throw new Error('No messsages');
    }
    const chat = await getChatId(userId1, userId2);
    const messages = await getChatMessages(chat);
    return messages;
  } catch (error) {
    throw error;
  }
}

export const getReceiverId = async (articleId: number) => {

  try {
    const author = await getAuthorIdByArticleId(articleId);
    return author.id;
  }
  catch (error) {
    throw error;
  }
}