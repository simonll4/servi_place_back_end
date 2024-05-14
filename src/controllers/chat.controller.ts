/* eslint-disable no-useless-catch */
import { thisChatExist, createChat, getChatId, getChatMessages } from '../data_base/chats.repository';
import { createMessage } from '../data_base/message.repository';

export const chatMessage = async (num1: string, num2: string, msg: string) => {
  try {

    // si el chat no existe lo creamos
    if (!await thisChatExist(Number(num1), Number(num2))) {
      createChat({ idUser1: Number(num1), idUser2: Number(num2) });
    }

    //TODO buscar id del destinatario con el id de la publicacion

    // obtenemos el chat por el id de los usuarios
    const chat = await getChatId(Number(num1), Number(num2));
    await createMessage({ content: msg, chatId: chat, authorId: Number(num1) });

  } catch (error) {
    throw error;
  }
};

export const chatHistory = async (num1: string, num2: string) => {
  try {
    if (await thisChatExist(Number(num1), Number(num2))) {
      const chat = await getChatId(Number(num1), Number(num2));
      const messages = await getChatMessages(chat);
      return messages;
    }
  } catch (error) {
    throw new Error('Error al recuperar mensajes');
  }
}