import { IUser } from './user.interface';
import { User } from './user.model';

export const createUser = async (userData: IUser) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch {
    return;
  }
};
export const UserServices = {
  createUser,
};
