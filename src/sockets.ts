/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, Socket } from 'socket.io';

import { authenticateTokenSocket } from './middlewares/auth.jwt';
import { chatHistory, chatMessage } from './controllers/chat.controller';
import { token } from 'morgan';
import { error } from 'console';
import { emit } from 'process';
import e from 'express';

export function sockerServer(io: Server) {


  io.on('connection', async (socket: Socket) => {
    console.log('a user connected');

    try {
      const id = await authenticateTokenSocket(String(socket.handshake.query.token));
    } catch (error) {
      socket.emit('scoket error', error);
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
    socket.on('chat message', async (msg, token, num2) => {
      try {
        if (!num2) {
          throw 'second parameter is required';
        }
        const id = await authenticateTokenSocket(token);
        chatMessage(id.toString(), num2, msg);
        console.log(`message id ${id}: ` + msg);
        io.emit('chat message', msg);

      } catch (error) {
        socket.emit('scoket error', error);
      }

      // authenticateTokenSocket(token)
      //   .then((decoded: unknown) => {
      //     const { id } = decoded as { id: number };
      //     console.log(id);
      //     chatMessage(id.toString(), num2, msg);
      //     io.emit('chat message', msg);

      //   })
      //   .catch((error) => {
      //     throw error;
      //   });

    });

    // evento escucha si alguien pide el historial de mensajes
    socket.on('chat history', async (num1, num2) => {

      try {
        const id = await authenticateTokenSocket(String(socket.handshake.query.token));
        const messages = await chatHistory(id.toString(), num2);
        socket.emit('set chat history', messages);
      } catch (error) {
        socket.emit('scoket error', error);
      }

      console.log('io', io.engine.clientsCount);
    });


    // evento desconectar
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}