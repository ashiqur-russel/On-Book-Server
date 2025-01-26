import { Router } from 'express';
import { ProductRouters } from '../modules/product/product.route';
import { OrderRouters } from '../modules/order/order.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: ProductRouters,
  },
  {
    path: '/orders',
    route: OrderRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
