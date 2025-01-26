import { Router } from 'express';
import productController from './product.controller';

const router = Router();

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:productId', productController.getProductById);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

export const ProductRouters = router;
