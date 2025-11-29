import postgres from 'postgres';
import {
  Id, Url, 
  Image, ImageRow, ImageRows,
  User, UserRow, UserRows,
  Shop, ShopRow, ShopRows,
  Review, ReviewRow, ReviewRows,
  Tag, TagRow, TagRows,
  Order, OrderRow, OrderRows,
  Product, ProductRow, ProductRows,
  ProductTagRow, ProductTagRows,
  OrderItem, ItemInOrderRow, ItemInOrderRows, 
  ReviewImageRow, ReviewImageRows,
  ProductImageRow, ProductImageRows
} from '@/app/lib/types';

const sql = postgres(process.env.POSTGRESS_URL!, { ssl: 'require' });

function dbError(e: Error, type: string): never {
  console.error(`Database error (${type}): ${e.message}`, e);
  throw new Error(`Failed to fetch ${type}`);
}

export async function fetchImageById(id: Id): Promise<Image> {
  try {
    const image = await sql<ImageRows>`SELECT * FROM image WHERE id = ${id};`;
    return image[0];
  } catch (e) {
    return dbError(e as Error, 'image');
  }
}

export async function fetchUserById(id: Id): Promise<User> {
  try {
    const user = (await sql<UserRows>`SELECT * FROM "user" WHERE id = ${id};`)[0];
    return { ...user, pfp: await fetchImageById(user.pfp) };
  } catch (e) {
    return dbError(e as Error, 'user');
  }
}

export async function fetchShopById(id: Id): Promise<Shop> {
  try {
    const shop = (await sql<ShopRows>`SELECT * FROM Shop WHERE id = ${id};`)[0];
    return {
      ...shop,
      manager: await fetchUserById(shop.manager),
      banner: await fetchImageById(shop.banner)
    };
  } catch (e) {
    return dbError(e as Error, 'shop');
  }
}

export async function fetchProductById(id: Id): Promise<Product> {
  try {
    const prod = (await sql<ProductRows>`SELECT * FROM product WHERE id = ${id};`)[0];
    return {
      ...prod,
      shop: await fetchShopById(prod.shop),
      tags: await fetchTagsOfProduct(prod.id),
      images: await fetchImagesOfProduct(prod.id)
    };
  } catch (e) {
    return dbError(e as Error, 'product');
  }
}

export async function fetchReviewById(id: Id): Promise<Review> {
  try {
    const rev = (await sql<ReviewRows>`SELECT * FROM review WHERE id = ${id};`)[0];
    return {
      ...rev,
      images: await fetchImagesOfReview(rev.id)
    };
  } catch (e) {
    return dbError(e as Error, 'review');
  }
}

export async function fetchTagById(id: Id): Promise<Tag> {
  try {
    return (await sql<TagRows>`SELECT * FROM tag WHERE id = ${id};`)[0];
  } catch (e) {
    return dbError(e as Error, 'tag');
  }
}

export async function fetchOrderById(id: Id): Promise<Order> {
  try {
    const order = (await sql<OrderRows>`SELECT * FROM order WHERE id = ${id};`)[0];
    return {
      ...order,
      buyer: await fetchUserById(order.buyer),
      seller: await fetchShopById(order.seller),
      items: await fetchOrderItemsByOrder(id)
    };
  } catch (e) {
    return dbError(e as Error, 'order');
  }
}

export async function fetchOrderItemsByOrder(orderId: Id): Promise<OrderItem[]> {
  return Promise.all((await sql<ItemInOrderRows>`SELECT * FROM item_in_order WHERE order = ${orderId}`).map(async orderItem => ({
    ...orderItem,
    product: await fetchProductById(orderItem.product)
  })));
}

export async function fetchProductsOfShopById(shopId: Id): Promise<Product[]> {
  const products = await sql<ProductRows>`SELECT * FROM product WHERE shop = ${shopId};`;

  const prods = Promise.all(products.map(async p => ({
    ...p,
    shop: await fetchShopById(p.shop),
    images: await fetchImagesOfProduct(p.id),
    tags: await fetchTagsOfProduct(p.id)
  })));

  return prods;
}

async function fetchImagesOfProduct(productId: Id): Promise<Image[]> {
  return [...(await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN product_image AS p ON i.id = p.image
      WHERE p.product = ${productId};
  `)];
}

async function fetchTagsOfProduct(productId: Id): Promise<Tag[]> {
  const tags = await sql<TagRows>`
    SELECT * FROM tag AS t
      JOIN product_has_tag AS p ON t.id = p.tag
      WHERE p.product = ${productId};
  `;
  return [...tags];
}

async function fetchImagesOfReview(reviewId: Id): Promise<Image[]> {
  const images = await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN product_image AS p ON i.id = p.id
      WHERE p.id = ${reviewId};
  `;
  return [...images];
}

export async function fetchProducts(count?: number): Promise<Product[]> {
  try {
    let prods;
    if(count) prods = await sql`SELECT * FROM product LIMIT = ${count}`;
    else prods = await sql`SELECT * FROM product`;

    return Promise.all(prods.map(async p => ({
      id: p.id,
      price: p.price,
      shop: p.shop,
      name: p.name,
      listed_at: new Date(p.listed_at),
      tags: await fetchTagsOfProduct(p.id),
      images: await fetchImagesOfProduct(p.id)
    })));
  } catch (e) {
    return dbError(e as Error, 'products');
  }
}

export async function fetchShops(count?: number): Promise<Shop[]> {
  try {
    let shops;

    if (count) shops = await sql<ShopRows>`SELECT * FROM shop LIMIT = count`;
    else shops = await sql<ShopRows>`SELECT * FROM shop`;

    return Promise.all(shops.map(async shop => ({
      ...shop,
      manager: await fetchUserById(shop.manager),
      banner: await fetchImageById(shop.banner)
    })));
  } catch (e) {
    return dbError(e as Error, 'shops');
  }
}
