import express from 'express';
import cors from 'cors';
import productRoutes from './app/modules/product/product.route';
import orderRoutes from './app/modules/order/order.route';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

export default app;
