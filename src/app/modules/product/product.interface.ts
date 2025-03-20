export type TCategory =
  | 'Fiction'
  | 'Science'
  | 'SelfDevelopment'
  | 'Poetry'
  | 'Religious'
  | 'Thriller';

export interface IOffer {
  offerRate: number;
  start: Date;
  end: Date;
}

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
  isFeatured?: boolean;
  offerRate?: number;
  rating?: number;
  productImg?: string;
  discountAmount?: number;
  offer?: IOffer | null;
}

export interface UploadFile {
  path: string;
  originalname: string;
  mimetype: string;
  filename?: string;
}
