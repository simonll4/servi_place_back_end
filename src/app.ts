import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import specialistRoutes from './router/specialist.routes'
import customerRoutes from './router/customer.routes'
import authRoute from './router/authentication/auth.routes'
import errorHandler from './middlewares/error.handler'
import { authenticateToken } from './middlewares/auth.jwt';


dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());

// ver que onda esto
// app.use(cors({
//     origin: '*'
// }));

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

export default app;