export type TCategory =
  | 'Fiction'
  | 'Science'
  | 'SelfDevelopment'
  | 'Poetry'
  | 'Religious';

export interface IProduct {
  title: string;
  author: string;
  price: number;
  category: TCategory;
  description: string;
  quantity: number;
  inStock: boolean;
  soldCount?: number;
  isBestSold?: boolean;
  hasOffer?: boolean;
  productImg?: string;
}
