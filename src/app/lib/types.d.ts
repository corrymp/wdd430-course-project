/** @description Database primary key */
export type Id = number;
export type Url = string;

//#region objects
export interface Image {
  id: Id;
  path: Url;
  alt_text: string;
  width: number;
  height: number;
};

export interface User {
  id: Id;
  name: string;
  pfp: Image;
  join_date: Date;
};

export interface Shop {
  id: Id;
  manager: User;
  name: string;
  location: string;
  banner: Image;
};

export interface Product {
  id: Id;
  shop: Shop;
  name: string;
  price: number;
  tags: Array<Tag>;
  images: Array<Image>;
  listed_at: Date;
};

export interface Review {
  id: Id;
  reviewer: Id;
  product: Id;
  title: string;
  content: string;
  rating: number;
  images: Array<Image>;
};

export interface Tag {
  id: Id;
  title: string;
};

export interface Order {
  id: Id;
  seller: Shop;
  buyer: User;
  items: Array<OrderItem>;
  amount: number;
  payed_at: Date|null;
};

export interface OrderItem {
  order: Id;
  product: Product;
  quantity: number;
}
//#endregion

//#region database
//#region tables rows
interface TableRow {
  id: Id;
};

export interface ImageRow extends TableRow {
  path: Url;
  alt_text: string;
  width: number;
  height: number;
};

export interface UserRow extends TableRow {
  name: string;
  pfp: Id;
  join_date: Date;
};

export interface ShopRow extends TableRow {
  name: string;
  manager: Id;
  banner: Id;
  location: string;
};

export interface ProductRow extends TableRow {
  name: string;
  shop: Id;
  price: number;
  listed_at: Date;
};

export interface ReviewRow extends TableRow {
  reviewer: Id;
  product: Id;
  title: string;
  content: string;
  rating: number;
  posted_at: Date;
};

export interface OrderRow extends TableRow {
  seller: Id;
  buyer: Id;
  amount: number;
  payed_at: Date | null;
};

export interface TagRow extends TableRow {
  title: string;
};
//#endregion
//#region joiner table rows

// product -< product_tag >- tag
export interface ProductTagRow {
  product: Id;
  tag: Id;
};

// product -< product_image >- image
export interface ProductImageRow {
  product: Id;
  image: Id;
};

// order -< item_in_order >- product
export interface ItemInOrderRow {
  product: Id;
  order: Id;
  quantity: number;
};

// review -< review_image >- image
export interface ReviewImageRow {
  review: Id;
  image: Id;
};
//#endregion
//#region tables
export type ImageRows = Array<ImageRow>;
export type UserRows = Array<UserRow>;
export type ShopRows = Array<ShopRow>;
export type ProductRows = Array<ProductRow>;
export type ReviewRows = Array<ReviewRow>;
export type OrderRows = Array<OrderRow>;
export type TagRows = Array<TagRow>;

export type ProductTagRows = Array<ProductTagRow>;
export type ProductImageRows = Array<ProductImageRow>;
export type ItemInOrderRows = Array<ItemInOrderRow>;
export type ReviewImageRows = Array<ReviewImageRow>;
//#endregion
//#endregion


export type Row = ImageRow|UserRow|ShopRow|ProductRow|ReviewRow|OrderRow|TagRow;
export type JoinerRow = ProductTagRow|ProductImageRow|ItemInOrderRow|ReviewImageRow;
