import express from 'express';
import cors from 'cors';
import productRoutes from './app/modules/product/product.route';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

export default app;
