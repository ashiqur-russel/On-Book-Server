import express from 'express';
import { PaymentControllers } from './payment.controller';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-checkout-session',
  AuthGuard(USER_ROLE.user),
  PaymentControllers.createCheckoutSession,
);

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentControllers.stripeWebhookHandler,
);

router.post(
  '/payment/:id/issue-refund',
  AuthGuard(USER_ROLE.admin),
  PaymentControllers.issueRefund,
);

export const PaymentRoutes = router;
