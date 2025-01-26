import { Types } from 'mongoose';

export type TCategory =
  | 'Fiction'
  | 'Science'
  | 'SelfDevelopment'
  | 'Poetry'
  | 'Religious';

export interface IProduct {
  title: string;
  author: Types.ObjectId;
  price: number;
  category: TCategory;
  description: string;
  quantity: number;
  inStock: boolean;
}
