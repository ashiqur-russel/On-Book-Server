import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/handleAppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

const createUser = async (userData: IUser) => {
  const userExists = await User.isUserExist(userData?.email);

  if (userExists && userExists.email === userData.email) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const user = await User.create(userData);
  return user;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const usersQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email', 'role'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await usersQuery.countTotal();

  const users = await usersQuery.modelQuery;

  return {
    meta,
    users,
  };
};

const getMe = async (email: string) => {
  const user = await User.find({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getMe,
};
