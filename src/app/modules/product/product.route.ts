import { Router, Request, Response, NextFunction } from 'express';
import productController from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.get('/', productController.getAllProducts);
router.post(
  '/',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProductValidation.createProductValidationSchema),

  productController.createProduct,
);
router.get('/best-sellers', productController.getBestSellingProduct);

router.get('/:productId', productController.getProductById);

router.put(
  '/:productId',
  validateRequest(ProductValidation.updateProductValidationSchema),

  productController.updateProduct,
);
router.delete(
  '/:productId',
  AuthGuard(USER_ROLE.admin),
  productController.deleteProduct,
);

export const ProductRouters = router;
