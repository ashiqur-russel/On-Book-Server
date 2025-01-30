import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { USER_ROLE } from './user.constant';
import AuthGuard from '../../middlewares/authGuard';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidation.userValidationSchema),
  UserControllers.registerUser,
);

router.get('/', AuthGuard(USER_ROLE.admin), UserControllers.getUsers);
router.get(
  '/me',
  AuthGuard(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getMe,
);
export const UserRoutes = router;
