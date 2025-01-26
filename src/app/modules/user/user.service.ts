import AppError from '../../errors/handleAppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

export const createUser = async (userData: IUser) => {
  const userExists = await User.isUserExist(userData?.email);

  if (userExists && userExists.email === userData.email) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const user = await User.create(userData);
  return user;
};

export const UserServices = {
  createUser,
};
