import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export type TUserRole = keyof typeof USER_ROLE;
