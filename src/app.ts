import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";


import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import router from './router/index'
import { sockerServer } from './sockets';
import errorHandler from './middlewares/error.handler';


dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  connectionStateRecovery: { maxDisconnectionDuration: 120000 },
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//http server routes 
app.use(router)
//socket events
sockerServer(io);

app.use((err, res) => {
  res.status(500).json({ error: err });
});

app.use(errorHandler);

export default httpServer;
