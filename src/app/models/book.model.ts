export interface Book {
  _id?: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

