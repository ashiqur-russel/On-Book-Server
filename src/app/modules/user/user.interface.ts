/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  status?: 'pending | blocked | approved | active | inactive';
  role: 'admin' | 'user';
}

export interface UserModel extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExist(id: string): Promise<IUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
