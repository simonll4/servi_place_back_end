/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import specialistRoutes from './router/specialist.routes'
import customerRoutes from './router/customer.routes'
import authRoute from './router/authentication/auth.routes'
import errorHandler from './middlewares/error.handler'
import { authenticateToken } from './middlewares/auth.jwt';

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(httpServer, {
  connectionStateRecovery: { maxDisconnectionDuration: 120000 },
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

import { createMessage } from './data_base/message.repository';
import { createChat, getChatId, getChatMessages, thisChatExist } from './data_base/chats.repository';

io.on('connection', async (socket) => {



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


app.get('/', (req, res) => {
res.status(201).json({ "saludo": "hello world" });
});

// app.get('/chat', (req, res) => {
//   const userId = req.body.id; // Obtener el ID del usuario con el que se quiere chatear
//   res.render('chat', { userId });
// });

//routes for auth
app.use('/auth', authRoute);
//routes for specialist
app.use('/specialist', authenticateToken, specialistRoutes);
//routes for customer
app.use('/customer', authenticateToken, customerRoutes);


app.use((err, res) => {
  res.status(500).json({ error: err });
});

app.use(errorHandler);

export default httpServer;
