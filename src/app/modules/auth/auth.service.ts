import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import AppError from '../../errors/handleAppError';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExist(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  const jwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as string);
  } catch {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not active');
  }

  const jwtPayload = {
    userId: isUserExist._id.toString(),
    name: isUserExist.name as string,
    email: isUserExist.email as string,
    role: isUserExist.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExist(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const userStatus = user?.status?.toLocaleLowerCase();

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt),
  );

  await User.findOneAndUpdate(
    { email: userData.email, role: userData.role },
    {
      password: newHashedPassword,
    },
  );
};
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
