import express from 'express'
import { createServer } from "http";
import { Server } from "socket.io";
import { sockerServer } from './sockets';
import dotenv from 'dotenv'
import morgan from 'morgan'

import router from './router/index'
import errorHandler from './middlewares/error.handler'
import { setupCors } from './middlewares/setup.cors';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  connectionStateRecovery: { maxDisconnectionDuration: 120000 },
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setupCors);
app.use(router);
app.use(errorHandler);

//socket events
sockerServer(io);

export default httpServer;
