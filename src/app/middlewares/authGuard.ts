import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import AppError from '../errors/handleAppError';

const AuthGuard = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    const token = authorizationHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { email, role } = decodedToken;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    if (requiredRoles && requiredRoles.includes(role)) {
      req.user = decodedToken;
      next();
    } else {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access!',
      );
    }
  });
};

export default AuthGuard;
