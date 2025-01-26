import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is up and running!',
    api_start_point: '/api',
  });
});

export default app;
