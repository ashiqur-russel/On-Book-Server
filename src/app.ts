import express from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use(globalErrorHandler);

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Server is up and running!', api_start_point: '/api' });
});

export default app;
