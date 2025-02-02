import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../../config';
import { PaymentServices } from './payment.service';

const stripe = new Stripe(config.stripe_secret_key as string, {});

export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.user;

    const { items, successUrl, cancelUrl, product } = req.body;

    if (!items || !email || !product) {
      throw new Error('Missing required parameters: items, email, product');
    }

    const sessionId = await PaymentServices.createStripeCheckoutSession({
      items,
      successUrl,
      cancelUrl,
      email,
      product,
    });

    if (!sessionId) {
      throw new Error('Stripe session ID is missing');
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Checkout session created successfully',
      data: { sessionId },
    });
  },
);

export const stripeWebhookHandler = catchAsync(
  async (req, res): Promise<void> => {
    try {
      const sig = req.headers['stripe-signature'];

      if (!sig) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: 'Webhook Error: Missing signature',
          data: null,
        });
        return;
      }

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body as Buffer,
          sig,
          config.stripe_webhook_secret as string,
        );
      } catch (err) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: `Webhook Signature Error: ${(err as Error).message}`,
          data: null,
        });
        return;
      }

      await PaymentServices.handleStripeWebhook(event);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Webhook processed successfully',
        data: {},
      });
    } catch {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  },
);

/**
 * ✅ Controller to Handle Refund Request
 */
export const issueRefund = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const refundResponse = await PaymentServices.issueRefund(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refund processed successfully',
    data: refundResponse,
  });
});

export const PaymentControllers = {
  createCheckoutSession,
  stripeWebhookHandler,
  issueRefund,
};
