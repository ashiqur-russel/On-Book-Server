export type TCategory = {
  category: 'Fiction' | 'Science' | 'SelfDevelopment' | 'Poetry' | 'Religious';
};

export interface IProduct {
  title: string;
  author: string;
  price: number;
  category: TCategory;
  description: string;
  quantity: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}
