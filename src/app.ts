import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

import router from './router/index'
import errorHandler from './middlewares/error.handler'
import { setupCors } from './middlewares/setup.cors';

dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setupCors)
app.use(router)
app.use(errorHandler)

export default app


