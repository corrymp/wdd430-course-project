'use server';
import postgres from 'postgres';
import {
  Id, Url,
  Image, ImageRows,
  User, UserRows,
  Shop, ShopRows,
  Review, ReviewRows,
  Tag, TagRows,
  Order, OrderRows,
  Product, ProductRows,
  OrderItem, ItemInOrderRows
} from '@/types/types';
import { mockImageList } from '@/app/lib/mock-data';

const sql = postgres(process.env.POSTGRESS_URL!, { ssl: 'require' });

function dbError(e: Error, type: string, ...rest: Array<unknown>): never {
  console.error(`Database error (${type}): ${e.message}${rest.length > 0 ? `; passed args: < ${rest.join(', ')} >` : ''}`, e);
  throw new Error(`Failed to ${type}`);
}

//#region image
export async function fetchImageById(id: Id): Promise<Image> {
  try {
    const image = await sql<ImageRows>`SELECT * FROM image WHERE id = ${id};`;
    return image[0];
  } catch (e) {
    return dbError(e as Error, 'fetchImageById', id);
  }
}

async function fetchImagesOfProduct(productId: Id): Promise<Image[]> {
  if (productId === undefined) {
    console.warn('Attempted to fetch images of product with missing ID');
    return mockImageList();
  }
  try {
    return [...(await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN product_image AS p ON i.id = p.image
      WHERE p.product = ${productId};
  `)];
  } catch (e) {
    return dbError(e as Error, 'fetchImagesOfProduct', productId);
  }
}

async function fetchImagesOfReview(reviewId: Id): Promise<Image[]> {
  try {
    const images = await sql<ImageRows>`
    SELECT * FROM image AS i
      JOIN review_image AS r ON i.id = r.image
      WHERE r.review = ${reviewId};
  `;
    return [...images];

  } catch (e) {
    return dbError(e as Error, 'fetchImagesOfReview', reviewId);
  }
}
//#endregion

//#region user
export async function fetchUserById(id: Id): Promise<User> {
  try {
    const user = (await sql<UserRows>`
      SELECT 
        id,
        name,
        pfp,
        join_date
      FROM "user" 
      WHERE id = ${id}
    `)[0];
    return { ...user, pfp: await fetchImageById(user.pfp) };
  } catch (e) {
    return dbError(e as Error, 'fetchUserById', id);
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
    return dbError(e as Error, 'fetchShopById', id);
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
    return dbError(e as Error, 'fetchShops', count);
  }
}

export interface ShopSearchResultShop {
  shopId: Id;
  shopName: string;
  location: string;
  banner: Image;

  bannerId: Id;
  bannerAlt: string;
  bannerPath: Url;
  bannerWidth: number;
  bannerHeight: number;

  sellerId: Id;
  sellerName: string;
  joined_date: Date;
  pfp: Image;

  pfpId: Id;
  pfpAlt: string;
  pfpPath: Url;
  pfpWidth: number;
  pfpHeight: number;
}

export interface ShopSearchResult {
  shops: ShopSearchResultShop[];
  pageCount: number;
}

export async function searchShopAndGetCount(query: string, yearsOnPlatform: string[], currentPage: number): Promise<ShopSearchResult> {
  if (!query) query = '';
  const [after, before] = yearsOnPlatform;//.map(date => dateFrom(date));
  const offset = (currentPage - 1) * 6;
  const qstring = `%${query}%`;
  try {
    const [count, products] = await Promise.all([
      sql`SELECT DISTINCT COUNT(*)
        FROM shop AS s
        JOIN "user" AS u ON u.id = s.manager
        WHERE 
          (u.join_date BETWEEN ${after} AND ${before}) AND 
          (u.name ILIKE ${qstring} OR 
          s.name ILIKE ${qstring} OR 
          s.location ILIKE ${qstring})`,

      sql<ShopSearchResultShop[]>`SELECT DISTINCT 
          s.id AS "shopId", 
          u.id AS "sellerId", 
          s.name AS "shopName", 
          u.name AS "sellerName", 
          s.location, u.join_date, 
          bnr.id AS "bannerId", 
          bnr.path AS "bannerPath", 
          bnr.alt_text AS "bannerAlt", 
          bnr.width AS "bannerWidth", 
          bnr.height AS "bannerHeight", 
          pfp.id AS "pfpId", 
          pfp.path AS "pfpPath", 
          pfp.alt_text AS "pfpAlt", 
          pfp.width AS "pfpWidth", 
          pfp.height AS "pfpHeight" 
        FROM shop AS s
        JOIN "user" AS u ON u.id = s.manager 
        JOIN image AS pfp ON pfp.id = u.pfp 
        JOIN image AS bnr ON bnr.id = s.banner 
        WHERE u.role = 'seller' AND
          (u.join_date BETWEEN ${after} AND ${before}) AND 
          (u.name ILIKE ${qstring} OR 
          s.name ILIKE ${qstring} OR 
          s.location ILIKE ${qstring})
        ORDER BY s.name LIMIT 6 OFFSET ${offset}`
    ]);

    return {
      shops: await Promise.all(products.map(async shop => ({
        ...shop,
        banner: {
          id: shop.bannerId,
          path: shop.bannerPath,
          alt_text: shop.bannerAlt,
          width: shop.bannerWidth,
          height: shop.bannerHeight
        },
        pfp: {
          id: shop.pfpId,
          path: shop.pfpPath,
          alt_text: shop.pfpAlt,
          width: shop.pfpWidth,
          height: shop.pfpHeight
        }
      }))),
      pageCount: Math.ceil(Number(count[0].count) / 6)
    };
  } catch (e) {
    return dbError(e as Error, 'searchShopAndGetCount', query, yearsOnPlatform, currentPage);
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
    return dbError(e as Error, 'fetchProductById', id);
  }
}

export async function fetchOrderItemsByOrder(orderId: Id): Promise<OrderItem[]> {
  try {
    return Promise.all((await sql<ItemInOrderRows>`SELECT * FROM item_in_order WHERE order = ${orderId}`).map(async orderItem => ({
      ...orderItem,
      product: await fetchProductById(orderItem.product)
    })));
  } catch (e) {
    return dbError(e as Error, 'fetchOrderItemsByOrder', orderId);
  }
}

export async function fetchProductsOfShopById(shopId: Id): Promise<Product[]> {
  try {
    const products = await sql<ProductRows>`SELECT * FROM product WHERE shop = ${shopId};`;

    const prods = Promise.all(products.map(async p => ({
      ...p,
      shop: await fetchShopById(p.shop),
      images: await fetchImagesOfProduct(p.id),
      tags: await fetchTagsOfProduct(p.id)
    })));

    return prods;
  } catch (e) {
    return dbError(e as Error, 'fetchProductsOfShopById', shopId);
  }
}

export async function fetchProducts(count?: number): Promise<Product[]> {
  try {
    let prods;
    if (count) prods = await sql`SELECT * FROM product LIMIT ${count}`;
    else prods = await sql`SELECT * FROM product`;

    return Promise.all(prods.map(async p => ({
      id: p.id,
      price: p.price,
      shop: await fetchShopById(p.shop),
      name: p.name,
      listed_at: new Date(p.listed_at),
      tags: await fetchTagsOfProduct(p.id),
      images: await fetchImagesOfProduct(p.id),
      description: p.description
    })));
  } catch (e) {
    return dbError(e as Error, 'fetchProducts', count);
  }
}

export interface ProductSearchResultProduct {
  prodId: Id;
  prodName: string;
  price: number;
  shopName: string;
  shopId: Id;
  managerId: Id;
  managerName: string;
  images: Image[];
  tags: Tag[];
  location: string;
}

export interface ProductSearchResult {
  products: ProductSearchResultProduct[];
  pageCount: number;
}

export async function searchProductsAndGetCount(query: string, priceRange: number[], currentPage: number): Promise<ProductSearchResult> {
  if (!query) query = '';
  const [lo, hi] = priceRange;
  const offset = (currentPage - 1) * 6;
  const qstring = `%${query}%`;
  try {
    const [count, products] = await Promise.all([
      sql`SELECT DISTINCT COUNT(*) 
          FROM product AS p
          JOIN product_has_tag AS pt ON p.id = pt.product
          JOIN shop AS s ON s.id = p.shop
          JOIN tag AS t ON pt.tag = t.id
        WHERE
          (p.price BETWEEN ${lo} AND ${hi}) AND
          (p.name ILIKE ${qstring} OR
          s.name ILIKE ${qstring} OR
          t.title ILIKE ${qstring})`,

      sql<ProductSearchResultProduct[]>`SELECT DISTINCT 
            p.id AS "prodId",
            p.name AS "prodName",
            p.price,
            u.name AS "managerName",
            u.id AS "managerId",
            s.name AS "shopName",
            s.id AS "shopId",
            s.location
          FROM product AS p
          JOIN product_has_tag AS pt ON p.id = pt.product
          JOIN shop AS s ON s.id = p.shop
          JOIN "user" AS u ON u.id = s.manager
          JOIN tag AS t ON pt.tag = t.id
        WHERE
          (p.price BETWEEN ${lo} AND ${hi}) AND
          (p.name ILIKE ${qstring} OR
          s.name ILIKE ${qstring} OR
          t.title ILIKE ${qstring}) 
        ORDER BY p.id LIMIT 6 OFFSET ${offset}`
    ]);

    return {
      products: await Promise.all(products.map(async prod => ({
        ...prod,
        tags: await fetchTagsOfProduct(prod.prodId),
        images: await fetchImagesOfProduct(prod.prodId)
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
    return dbError(e as Error, 'fetchReviewById', id);
  }
}

export async function fetchReviewsOfProduct(productId: Id): Promise<Review[]> {
  try {
    const revs = await sql<ReviewRows>`SELECT * FROM review AS r WHERE r.product = ${productId}`;
    return Promise.all(revs.map(async rev => ({
      ...rev,
      reviewer: await fetchUserById(rev.reviewer),
      product: await fetchProductById(rev.product),
      images: await fetchImagesOfReview(rev.id)
    })));

  } catch (e) {
    return dbError(e as Error, 'fetchReviewsOfProduct', productId);
  }
}

export async function fetchReviewsOfSeller(storeId: Id): Promise<Review[]> {
  try {
    const revs = await sql<ReviewRows>`
    SELECT r.id, r.title, r.content, r.reviewer, r.posted_at, r.product, r.rating
      FROM review AS r 
      JOIN product AS p ON r.product = p.id
      WHERE p.shop = ${storeId}
  `;
    return Promise.all(revs.map(async rev => ({
      ...rev,
      rating: parseFloat(String(rev.rating)),
      reviewer: await fetchUserById(rev.reviewer),
      product: await fetchProductById(rev.product),
      images: [/*images are not shown on seller profiles*/]
    })));

  } catch (e) {
    return dbError(e as Error, 'fetchReviewsOfSeller', storeId);
  }
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
    return dbError(e as Error, 'fetchOrderById', id);
  }
}

export async function getTotalSales(storeId: Id): Promise<number> {
  try {
    return (await sql<{ total: number | null; }[]>`
      SELECT SUM("quantity") AS total
        FROM item_in_order AS i
        JOIN "order" AS o ON o.id = i.order
        WHERE o.seller = ${storeId}
    `)[0].total ?? 0;
  } catch (e) {
    return dbError(e as Error, 'getTotalSales');
  }
}

//#endregion

//#region tag
export async function fetchTagById(id: Id): Promise<Tag> {
  try {
    return (await sql<TagRows>`SELECT * FROM tag WHERE id = ${id};`)[0];
  } catch (e) {
    return dbError(e as Error, 'fetchTagById', id);
  }
}

async function fetchTagsOfProduct(productId: Id): Promise<Tag[]> {
  if (productId === undefined) {
    console.warn('Attempted to fetch tags of product with missing ID');
    return [];
  }
  try {
    const tags = await sql<TagRows>`
      SELECT * FROM tag AS t
        JOIN product_has_tag AS p ON t.id = p.tag
        WHERE p.product = ${productId};
    `;
    return [...tags];
  } catch (e) {
    return dbError(e as Error, 'fetchTagsOfProducts', productId);
  }
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
