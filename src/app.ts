import dotenv from 'dotenv';
import express from 'express';

import authRoute from './router/authRoute'
import userRoute from './router/userRoute';

dotenv.config();
const app = express();
app.use(express.json());

//routes
app.use('/auth', authRoute);
app.use('/users', userRoute);


export default app;