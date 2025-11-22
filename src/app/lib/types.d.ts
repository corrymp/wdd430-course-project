/** @description Database primary key */
export type Id = string | number;
export type Url = string;

export interface User {
  id: Id;
  name: string;
  picture: Url;
};

export interface Seller extends User {
  location: string;
  joinDate: Date;
  shopName: string;
  shopBanner: Url;
};

export interface Product {
  id: Id;
  sellerId: Id;
  name: string;
  price: number;
  tags: Tag[];
  images: string[];
};

export interface Tag {
  id: Id;
  title: string;
};

export interface Invoice {
  id: Id;
  buyerId: Id;
  itemId: Id;
  amount: number;
  paymentDate?: Date;
};
