import postgres from 'postgres';
import {
  Id, Url, Image,
  ImageRow, ImageRows,
  User, UserRow, UserRows,
  Shop, ShopRow, ShopRows,
  Review, ReviewRow, ReviewRows,
  Tag, TagRow, TagRows,
  Order, OrderRow, OrderRows,
  Product, ProductRow, ProductRows,
  ProductTagRow,

  ItemInOrderRow, ProductImageRow, ReviewImageRow,
  ProductTagRows, ItemInOrderRows, ReviewImageRows
} from '@/app/lib/types';

function dbError(e: Error, type: string) {
  console.error(`Database error (${type}): ${e.message}`, e);
  throw new Error(`Failed to fetch ${type}`);
}

const sql = postgres(process.env.POSTGRESS_URL!, { ssl: 'require' });

export async function fetchImageById(id: Id) {
  try {
    const image = await sql<ImageRows>`SELECT * FROM image WHERE id = ${id};`;

    return image[0];
  } catch (e) {
    dbError(e as Error, 'image');
  }
}
export async function fetchUserById(id: Id) {
  try {
    const user = await sql<UserRows>`SELECT * FROM user WHERE id = ${id};`;
    return user[0];
  } catch (e) {
    dbError(e as Error, 'user');
  }
}
export async function fetchShopById(id: Id) {
  try {
    const shop = await sql<ShopRows>`SELECT * FROM Shop WHERE id = ${id};`;
    return shop[0];
  } catch (e) {
    dbError(e as Error, 'shop');
  }
}
export async function fetchProductById(id: Id) {
  try {
    const prod = await sql<ProductRows>`SELECT * FROM product WHERE id = ${id};`;
    return prod[0];
  } catch (e) {
    dbError(e as Error, 'product');
  }
}
export async function fetchReviewById(id: Id) {
  try {
    const rev = await sql<ReviewRows>`SELECT * FROM review WHERE id = ${id};`;
    return rev[0];
  } catch (e) {
    dbError(e as Error, 'review');
  }
}
export async function fetchTagById(id: Id) {
  try {
    const tag = await sql<TagRows>`SELECT * FROM tag WHERE id = ${id};`;
    return tag[0];
  } catch (e) {
    dbError(e as Error, 'tag');
  }
}
export async function fetchOrderById(id: Id) {
  try {
    const order = await sql<OrderRows>`SELECT * FROM order WHERE id = ${id};`;
    return order[0];
  } catch (e) {
    dbError(e as Error, 'order');
  }
}

export async function fetchProductsOfShopById(shopId: Id) {
  const products = await sql<ProductRows>`SELECT * FROM product WHERE shop = ${shopId};`;
  
  const prods = products.map(async p => ({
    ...p,
    images: await fetchImagesOfProduct(p.id),
    tags: await fetchTagsOfProduct(p.id)
  }));

  return [...prods];
}

async function fetchImagesOfProduct(productId: Id) {
  const images = await sql<ImageRows>`
    SELECT * FROM image i
      JOIN product_image p ON i.id = p.id
      WHERE p.id = ${productId};
  `;
  return [...images];
}

async function fetchTagsOfProduct(productId: Id) {
  const tags = await sql<TagRows>`
    SELECT * FROM tag t
      JOIN product_tag p ON t.id = p.id
      WHERE p.id = ${productId};
  `;
  return [...tags];
}


// async function fetchUserById(id: Id): User {}
// async function fetchUserById(id: Id): User {}
// async function fetchUserById(id: Id): User {}
// async function fetchUserById(id: Id): User {}
// async function fetchUserById(id: Id): User {}
// async function fetchUserById(id: Id): User {}


