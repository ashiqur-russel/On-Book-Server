import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Product } from '../product/product.model';

const resetOffer = catchAsync(async (req: Request, res: Response) => {
  const now = new Date();

  const { modifiedCount } = await Product.updateMany(
    { 'offer.end': { $lte: now } },
    { $set: { offer: null, hasOffer: false } },
  );

  console.log(
    `${new Date().toISOString()} — Cleared ${modifiedCount} expired offers`,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Cleared ${modifiedCount} expired offers`,
    data: { modifiedCount },
  });
});

export const cronControllers = { resetOffer };
