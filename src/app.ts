import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

// import specialistRoutes from './router/specialist.routes'
// import customerRoutes from './router/customer.routes'
// import authRoute from './router/authentication/auth.routes'

// import { authenticateToken } from './middlewares/auth.jwt';
import router from './router/index'
import errorHandler from './middlewares/error.handler'




dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());

// ver que onda esto
// app.use(cors({
//     origin: '*'
// }));

app.use(router)


app.use((err, res) => {
  res.status(500).json({ error: err });
});

app.use(errorHandler);

export default app;