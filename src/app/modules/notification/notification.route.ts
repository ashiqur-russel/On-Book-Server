// src/modules/notification/notification.route.ts
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

router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.user),
  notificationControllers.getNotifications,
);

router.patch(
  '/:id/read',
  AuthGuard(USER_ROLE.admin, USER_ROLE.user),
  notificationControllers.markNotificationRead,
);
export const NotificationRouters = router;
