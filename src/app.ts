import dotenv from 'dotenv';
import express from 'express';
import authRoute from './router/authRoute'

dotenv.config();
const app = express();
app.use(express.json());

//routes
app.use('/auth', authRoute);


export default app;