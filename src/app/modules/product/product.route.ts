import { Router } from 'express';
import productController from './product.controller';

const router = Router();

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProduct);

export default router;
