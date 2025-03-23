import express from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://book-on-client.vercel.app'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use('/api', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Server is up and running!', api_start_point: '/api' });
});

import './app/utils/cronJob';

export default app;
