import { Server, Socket } from 'socket.io';
import { createChat, thisChatExist, getChatId,getChatMessages } from './data_base/chats.repository';
import { createMessage } from './data_base/message.repository';

export function handleConnection(io: Server) {

  io.on('connection', async (socket: Socket) => {

    console.log(`a user connected ${socket.id} `);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', async (msg, num1, num2) => {
      console.log('message: ' + msg);
      
      
      
      try {
        if (!await thisChatExist(Number(num1), Number(num2))) {
          createChat({ idUser1: Number(num1), idUser2: Number(num2) });
        }
        const chat = await getChatId(Number(num1), Number(num2));
        await createMessage({ content: msg, chatId: chat, authorId: Number(num1) });
      } catch (error) {
        console.log(error);
        return;
      }

      io.emit('chat message', msg);

    });

    socket.on('chat history', async (num1, num2) => {

      try {
        if (await thisChatExist(Number(num1), Number(num2))) {
          const chat = await getChatId(Number(num1), Number(num2));
          const messages = await getChatMessages(chat || 0);
          io.emit('set chat history', messages);
          console.log('ioasdasd', io.engine.clientsCount);
        }
      } catch (error) {
        throw new Error('Error al recuperar mensajes');
      }

      console.log('io', io.engine.clientsCount);
    });
  });
}