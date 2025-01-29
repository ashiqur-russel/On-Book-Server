import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.registerUser,
);

router.get('/',
  
   UserControllers.getUsers);
export const UserRoutes = router;
