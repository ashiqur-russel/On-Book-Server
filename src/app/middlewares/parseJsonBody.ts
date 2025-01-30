import { NextFunction, Request, Response } from 'express';

export const pasrseJsonBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = JSON.parse(req.body.data);
  next();
};
