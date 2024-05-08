import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import specialistRoutes from './router/specialist.routes'
import customerRoutes from './router/customer.routes'
import errorHandler from './middlewares/errorHandler'


dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json());

// ver que onda esto
// app.use(cors({
//     origin: '*'
// }));

//routes for specialist
app.use('/specialist', specialistRoutes);
//routes for customer
app.use('/customer', customerRoutes);

app.use(errorHandler);

export default app;