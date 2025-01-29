import { Router } from 'express';
import productController from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', AuthGuard(USER_ROLE.admin), productController.getAllProducts);
router.post(
  '/',
  AuthGuard(USER_ROLE.admin),
  validateRequest(ProductValidation.createProductValidationSchema),
  productController.createProduct,
);
router.get('/:productId', productController.getProductById);
router.put(
  '/:productId',
  AuthGuard(USER_ROLE.admin),
  validateRequest(ProductValidation.updateProductValidationSchema),
  productController.updateProduct,
);
router.delete(
  '/:productId',
  AuthGuard(USER_ROLE.admin),
  productController.deleteProduct,
);

export const ProductRouters = router;
