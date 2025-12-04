'use server'
import postgres from 'postgres';
import {
  Id,
  Image, ImageRows,
  User, UserRows,
  Shop, ShopRows,
  Review, ReviewRows,
  Tag, TagRows,
  Order, OrderRows,
  Product, ProductRows,
  OrderItem, ItemInOrderRows
} from '@/types/types';

const sql = postgres(process.env.POSTGRESS_URL!, { ssl: 'require' });

function dbError(e: Error, type: string, ...rest: Array<unknown>): never {
  console.error(`Database error (${type}): ${e.message}${rest.length > 0 ? `; passed args: < ${rest.join(', ')} >` : ''}`, e);
  throw new Error(`Failed to fetch ${type}`);
}

//#region image
export async function fetchImageById(id: Id): Promise<Image> {
  try {
    const image = await sql<ImageRows>`SELECT * FROM image WHERE id = ${id};`;
    return image[0];
  } catch (e) {
    return dbError(e as Error, 'image');
  }
}

async function fetchImagesOfProduct(productId: Id): Promise<Image[]> {
  return [...(await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN product_image AS p ON i.id = p.image
      WHERE p.product = ${productId};
  `)];
}

async function fetchImagesOfReview(reviewId: Id): Promise<Image[]> {
  const images = await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN review_image AS r ON i.id = r.image
      WHERE r.review = ${reviewId};
  `;
  return [...images];
}
//#endregion

//#region user
export async function fetchUserById(id: Id): Promise<User> {
  try {
    const user = (await sql<UserRows>`SELECT * FROM "user" WHERE id = ${id};`)[0];
    return { ...user, pfp: await fetchImageById(user.pfp) };
  } catch (e) {
    return dbError(e as Error, 'user');
  }
}
//#endregion

//#region shop
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

export async function fetchShops(count?: number): Promise<Shop[]> {
  try {
    let shops;

    if (count) shops = await sql<ShopRows>`SELECT * FROM shop LIMIT ${count}`;
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
//#endregion

//#region product
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
    return dbError(e as Error, 'product', id);
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

export async function fetchProducts(count?: number): Promise<Product[]> {
  try {
    let prods;
    if (count) prods = await sql`SELECT * FROM product LIMIT ${count}`;
    else prods = await sql`SELECT * FROM product`;

    return Promise.all(prods.map(async p => ({
      id: p.id,
      price: p.price,
      shop: p.shop,
      name: p.name,
      listed_at: new Date(p.listed_at),
      tags: await fetchTagsOfProduct(p.id),
      images: await fetchImagesOfProduct(p.id),
      description: p.description
    })));
  } catch (e) {
    return dbError(e as Error, 'products');
  }
}

export interface SuperProduct {
  id: Id;
  name: string;
  price: number;
  shopName: string;
  shopId: Id;
  shop: Shop;
  manager: Id;
  images: Image[];
  tags: Tag[];
  location:string;
}

export async function searchProductsAndGetCount(query: string, priceRange: number[], currentPage: number) {
  const [lo, hi] = priceRange;
  const offset = (currentPage - 1) * 6;
  const qstring = `%${query}%`;
  try {
    const [count, products] = await Promise.all([
      sql`SELECT DISTINCT COUNT(*) FROM product AS p
          JOIN product_has_tag AS pt ON p.id = pt.product
          JOIN shop AS s ON s.id = p.shop
          JOIN tag AS t ON pt.tag = t.id
        WHERE
          (p.price BETWEEN ${lo} AND ${hi}) AND
          (p.name ILIKE ${qstring} OR
          s.name ILIKE ${qstring} OR
          t.title ILIKE ${qstring})`,

      sql<SuperProduct[]>`SELECT DISTINCT 
            p.id, 
            p.name, 
            p.price, 
            s.name AS shopName, 
            s.id AS shopId,
            s.manager AS managerId
          FROM product AS p
          JOIN product_has_tag AS pt ON p.id = pt.product
          JOIN shop AS s ON s.id = p.shop
          JOIN tag AS t ON pt.tag = t.id
        WHERE
          (p.price BETWEEN ${lo} AND ${hi}) AND
          (p.name ILIKE ${qstring} OR
          s.name ILIKE ${qstring} OR
          t.title ILIKE ${qstring}) ORDER BY p.id LIMIT 6 OFFSET ${offset}`
    ]);

    return {
      products: await Promise.all(products.map(async prod => ({
        ...prod,
        tags: await fetchTagsOfProduct(prod.id),
        images: await fetchImagesOfProduct(prod.id)
      }))),
      pageCount: Math.ceil(Number(count[0].count) / 6)
    };
  } catch (e) {
    return dbError(e as Error, 'searchProductsAndGetCount', query, priceRange, currentPage);
  }
}

//#endregion

//#region review
export async function fetchReviewById(id: Id): Promise<Review> {
  try {
    const rev = (await sql<ReviewRows>`SELECT * FROM review WHERE id = ${id};`)[0];
    return {
      ...rev,
      reviewer: await fetchUserById(rev.reviewer),
      product: await fetchProductById(rev.product),
      images: await fetchImagesOfReview(rev.id)
    };
  } catch (e) {
    return dbError(e as Error, 'review');
  }
}

export async function fetchReviewsOfProduct(productId: Id): Promise<Review[]> {
  const revs = await sql<ReviewRows>`SELECT * FROM review AS r WHERE r.product = ${productId}`;
  return Promise.all(revs.map(async rev => ({
    ...rev,
    reviewer: await fetchUserById(rev.reviewer),
    product: await fetchProductById(rev.product),
    images: await fetchImagesOfReview(rev.id)
  })));
}

export async function fetchReviewsOfSeller(storeId:Id): Promise<Review[]> {
  const revs = await sql<ReviewRows>`
    SELECT r.id, r.title, r.content, r.reviewer, r.posted_at, r.product
      FROM review AS r 
      JOIN product AS p ON r.product = p.id
      WHERE p.shop = ${storeId}
  `;
  return Promise.all(revs.map(async rev => ({
    ...rev,
    reviewer: await fetchUserById(rev.reviewer),
    product: await fetchProductById(rev.product),
    images: [/*images are not shown on seller profiles*/]
  })));
}


//#endregion

//#region order
export async function fetchOrderById(id: Id): Promise<Order> {
  try {
    const order = (await sql<OrderRows>`SELECT * FROM order WHERE id = ${id};`)[0];
    const items = await fetchOrderItemsByOrder(id);
    return {
      ...order,
      buyer: await fetchUserById(order.buyer),
      seller: await fetchShopById(order.seller),
      amount: items.reduce((acc, cur) => acc + cur.product.price, 0),
      items
    };
  } catch (e) {
    return dbError(e as Error, 'order');
  }
}
//#endregion

//#region tag
export async function fetchTagById(id: Id): Promise<Tag> {
  try {
    return (await sql<TagRows>`SELECT * FROM tag WHERE id = ${id};`)[0];
  } catch (e) {
    return dbError(e as Error, 'tag');
  }
}

async function fetchTagsOfProduct(productId: Id): Promise<Tag[]> {
  const tags = await sql<TagRows>`
    SELECT * FROM tag AS t
      JOIN product_has_tag AS p ON t.id = p.tag
      WHERE p.product = ${productId};
  `;
  return [...tags];
}

export async function fetchTags(): Promise<Tag[]> {
  try {
    const tags = await sql<TagRows>`SELECT * FROM tag`;
    return [...tags];
  } catch (e) {
    dbError(e as Error, 'fetchTags');
  }
}

//#endregion
