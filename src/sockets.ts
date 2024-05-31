import { Server, Socket } from 'socket.io';
import { authenticateTokenSocket } from './middlewares/auth.jwt';
import { chatHistory, chatMessage } from './controllers/chat.controller';

export function sockerServer(io: Server) {


  io.on('connection', async (socket: Socket) => {
    try {
      const id = await authenticateTokenSocket(String(socket.handshake.query.token));
      console.log(`a user connected ${id}`);
      socket.emit('send sesionId', id);
    } catch (error) {
      socket.emit('socket error', error);
    }

    // evento escucha nuevos mensajes
    socket.on('new message', async (msg, userId) => {
      try {
        if (!userId) {
          throw 'User id is required';
        }

        const id = await authenticateTokenSocket(String(socket.handshake.query.token));

        const createdMsg = await chatMessage(id.toString(), String(userId), msg);

        //pruebas
        console.log("id del receptor: ", userId);
        console.log(`message de ${id} a ${userId} : ` + msg);

        io.emit('set message', createdMsg);
      } catch (error) {
        socket.emit('socket error', error);
      }
    });


    // evento escucha si alguien pide el historial de mensajes
    // se le pasa el id del articulo para buscar el autor para contactarlo
    socket.on('chat history', async (userId) => {

      try {
        const id = await authenticateTokenSocket(String(socket.handshake.query.token));

        console.log(`chat history with ${id} ${userId}`);

        const messages = await chatHistory(id, userId);

        socket.emit('set chat history', messages);

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
