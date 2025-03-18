import { Router } from 'express';

import { notificationControllers } from './notification.controller';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  AuthGuard(USER_ROLE.admin),
  notificationControllers.sendRefundNotification,
);

export const NotificationRouters = router;
