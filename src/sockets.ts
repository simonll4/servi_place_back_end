/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, Socket } from 'socket.io';

import { authenticateTokenSocket } from './middlewares/auth.jwt';
import { chatHistory, chatMessage, getReceiverId } from './controllers/chat.controller';


export function sockerServer(io: Server) {


  io.on('connection', async (socket: Socket) => {

    try {
      const id = await authenticateTokenSocket(String(socket.handshake.query.token));
      console.log(`a user connected ${id}`);
      socket.emit('send sesionId',id);
    } catch (error) {
      socket.emit('socket error', error);
    }

    

    // authenticateTokenSocket(String(socket.handshake.query.token))
    //   .then((decoded: unknown) => {
    //     const { id } = decoded as { id: number };
    //     console.log(id);
    //   })
    //   .catch((error: unknown) => {
    //     socket.emit('error', error);
    //   });



    // evento escucha nuevos mensajes
    socket.on('new message', async (msg, articleIdReceiver) => {
      try {
        if (!articleIdReceiver) {
          throw 'The articleId receiver  is required';
        }
        const id = await authenticateTokenSocket(String(socket.handshake.query.token));
        const receiverId = await getReceiverId(Number(articleIdReceiver));
        if (id == receiverId) {
          throw 'You cannot send a message to yourself';
        }
        const createdMsg = await chatMessage(id.toString(), String(receiverId), msg);

        //pruebas
        console.log("id del articulo: ", articleIdReceiver);
        console.log("id del receptor: ", receiverId);
        console.log(`message de ${id} a ${receiverId} : ` + msg);

        io.emit('set message', createdMsg, id);

      } catch (error) {
        socket.emit('socket error', error);
      }
    });

    // evento escucha si alguien pide el historial de mensajes
    // se le pasa el id del articulo para buscar el autor para contactarlo
    socket.on('chat history', async (articleIdReceiver) => {

      try {
        const id = await authenticateTokenSocket(String(socket.handshake.query.token));
        const receiverId = await getReceiverId(Number(articleIdReceiver));

        console.log(`chat history with ${id} ${receiverId}`);
        const messages = await chatHistory(id, receiverId);
        socket.emit('set chat history', messages, id);

      } catch (error) {
        socket.emit('socket error', { message: error });
      }

    });


    // evento desconectar
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}