import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors';


import router from './router/index'
import errorHandler from './middlewares/error.handler'

dotenv.config()
const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router)

//MIDDLEWWARE FINAL
app.use(errorHandler)


export default app


