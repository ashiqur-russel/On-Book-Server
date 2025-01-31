import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'ttps://book-on-client-8px8a0y3m-ashiqurrussels-projects.vercel.app',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

//Routes
app.use('/api', router);
app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is up and running!',
    api_start_point: '/api',
  });
});

export default app;
