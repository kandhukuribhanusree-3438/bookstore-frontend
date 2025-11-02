export interface Order {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  bookName: string;
  quantity: number;
  address: string;
  totalPrice: number;
  date?: Date;
}

