'use server';
import { z } from 'zod';
import postgres from 'postgres';
import {date, dateFrom} from '@/app/lib/utils';

const sql = postgres(process.env.POSTGRESS_URL!, { ssl: 'require' });

//#region schemas
//#region base schemas
const ImageSchema = z.object({
  id: z.int(),
  path: z.url(),
  alt_text: z.string(),
  width: z.int(),
  height: z.int()
});
const UserSchema = z.object({
  id: z.int(),
  name: z.string(),
  pfp: z.int().optional(),
  join_date: z.date()
});
const ShopSchema = z.object({
  id: z.int(),
  name: z.string(),
  manager: z.int(),
  banner: z.int(),
  location: z.string()
});
const ProductSchema = z.object({
  id: z.int(),
  name: z.string(),
  shop: z.int(),
  price: z.number(),
  listed_at: z.date(),
  description: z.string()
});
const ReviewSchema = z.object({
  id: z.int(),
  reviewer: z.int(),
  product: z.int(),
  title: z.string(),
  content: z.string(),
  rating: z.number(),
  posted_at: z.date()
});
const OrderSchema = z.object({
  id: z.int(),
  seller: z.int(),
  buyer: z.int(),
  payed_at: z.date().optional()
});
const TagSchema = z.object({
  id: z.int(),
  title: z.string()
});
//#endregion

//#region create schemas
const CreateImage = ImageSchema.omit({ id: true });
const CreateUser = UserSchema.omit({ id: true, join_date: true, pfp: true });
const CreateShop = ShopSchema.omit({ id: true });
const CreateProduct = ProductSchema.omit({ id: true, listed_at: true });
const CreateReview = ReviewSchema.omit({ id: true, posted_at: true });
const CreateOrder = OrderSchema.omit({ id: true, payed_at: true });
const CreateTag = TagSchema.omit({ id: true });
//#endregion

//#region update schemas
const UpdateImage = ImageSchema;
const UpdateUser = UserSchema;
const UpdateShop = ShopSchema;
const UpdateProduct = ProductSchema;
const UpdateReview = ReviewSchema;
const UpdateOrder = OrderSchema;
const UpdateTag = TagSchema;
//#endregion
//#endregion

//#region state
export interface State {
  message?: string | null;
  errors?: object;
};
export interface ImageState extends State {
  errors?: {
    path?: string[];
    alt_text?: string[];
    width?: string[];
    height?: string[];
  }
}
export interface UserState extends State {
  errors?: {
    name?: string[];
    pfp?: string[];
    join_date?: string[];
  }
}
export interface ShopState extends State {
  errors?: {
    manager?: string[];
    name?: string[];
    location?: string[];
    banner?: string[];
  }
}
export interface ProductState extends State {
  errors?: {
    shop?: string[];
    name?: string[];
    price?: string[];
    tags?: string[];
    images?: string[];
    listed_at?: string[];
    description?: string[];
  }
}
export interface ReviewState extends State {
  errors?: {
    reviewer?: string[];
    product?: string[];
    title?: string[];
    content?: string[];
    rating?: string[];
    images?: string[];
  }
}
export interface TagState extends State {
  errors?: {
    title?: string[];
  }
}
export interface OrderState extends State {
  errors?: {
    seller?: string[];
    buyer?: string[];
    items?: string[];
    amount?: string[];
    payed_at?: string[];
  }
}
//#endregion

//#region image
export async function createImage(prevState: ImageState, formData: FormData) {
  const validatedFields = CreateImage.safeParse({
    path: formData.get('path'),
    alt_text: formData.get('alt_text'),
    width: formData.get('width'),
    height: formData.get('height')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to add image: missing required info'
  };

  const { path, alt_text, width, height } = validatedFields.data;

  try {
    const addResult = await sql`
      INSERT 
        INTO image ( path, alt_text, width, height )
        VALUES ( ${path}, ${alt_text}, ${width}, ${height} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the image failed to be added' };
  }
}
export async function updateImage(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateImage.safeParse({
    id: id,
    path: formData.get('path'),
    alt_text: formData.get('alt_text'),
    width: formData.get('width'),
    height: formData.get('height')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update image: missing required info'
  };

  const { path, alt_text, width, height } = validatedFields.data;

  try {
    await sql`
      UPDATE image 
        SET path = ${path}, 
            alt_text = ${alt_text}, 
            width = ${width}, 
            height =  ${height}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the image failed to be updated' };
  }
}
export async function deleteImage(id: number) {
  try {
    await sql`DELETE FROM image WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the image failed to be deleted'}
  }
}
//#endregion

//#region user
export async function createUser(prevState: State, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to create user: missing required info'
  };

  const join_date = date();

  const { name } = validatedFields.data;

  try {
    const addResult = await sql`
      INSERT 
        INTO user ( name, join_date )
        VALUES ( ${name}, ${join_date} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the user failed to be created' };
  }
}
export async function updateUser(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateUser.safeParse({
    id: id,
    name: formData.get('name'),
    join_date: formData.get('join_date'),
    pfp: formData.get('pfp')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update user: missing required info'
  };

  const { name, join_date, pfp} = validatedFields.data;
  const joinDate = dateFrom(join_date);

  try {
    await sql`
      UPDATE user
        SET name      = ${name},
            join_date = ${joinDate},
            pfp       = ${pfp ?? null}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the user failed to be updated' };
  }
}
export async function deleteUser(id: number) {
  try {
    await sql`DELETE FROM user WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the user failed to be deleted'}
  }
}
//#endregion

//#region shop
export async function createShop(prevState: State, formData: FormData) {
  const validatedFields = CreateShop.safeParse({
    name: formData.get('name'),
    manager: formData.get('manager'),
    banner: formData.get('banner'),
    location: formData.get('location')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to create shop: missing required info'
  };

  const { name, manager, banner, location } = validatedFields.data;

  try {
    const addResult = await sql`
      INSERT 
        INTO shop ( name, manager, banner, location )
        VALUES ( ${name}, ${manager}, ${banner}, ${location} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the store failed to be created' };
  }
}
export async function updateShop(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateShop.safeParse({
    id: id,
    name: formData.get('name'),
    manager: formData.get('manager'),
    banner: formData.get('banner'),
    location: formData.get('location')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update shop: missing required info'
  };

  const { name, manager, banner, location } = validatedFields.data;

  try {
    await sql`
      UPDATE shop 
        SET name = ${name}, 
            manager = ${manager}, 
            banner = ${banner}, 
            location = ${location}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the store failed to be updated' };
  }
}
export async function deleteShop(id: number) {
  try {
    await sql`DELETE FROM shop WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the shop failed to be deleted'}
  }
}
//#endregion

//#region product
export async function createProduct(prevState: State, formData: FormData) {
  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    shop: formData.get('shop'),
    price: formData.get('price'),
    description: formData.get('description')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to add product: missing required info'
  };

  const { name, shop, price, description } = validatedFields.data;
  const listed_at = date();

  try {
    const addResult = await sql`
      INSERT 
        INTO product ( name, shop, price, description, listed_at )
        VALUES ( ${name}, ${shop}, ${price}, ${description}, ${listed_at} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the product failed to be added' };
  }
}
export async function updateProduct(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateProduct.safeParse({
    id: id,
    name: formData.get('name'),
    shop: formData.get('shop'),
    price: formData.get('price'),
    description: formData.get('description')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update product: missing required info'
  };

  const { name, shop, price, description, listed_at } = validatedFields.data;
  const listedAt = dateFrom(listed_at);

  try {
    await sql`
      UPDATE product 
        SET name = ${name}, 
            shop = ${shop}, 
            price = ${price}, 
            description = ${description}, 
            listed_at = ${listedAt}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the product failed to be updated' };
  }
}
export async function deleteProduct(id: number) {
  try {
    await sql`DELETE FROM product WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the product failed to be deleted'}
  }
}
//#endregion

//#region review
export async function createReview(prevState: State, formData: FormData) {
  const validatedFields = CreateReview.safeParse({
    reviewer: formData.get('reviewer'),
    product: formData.get('product'),
    title: formData.get('title'),
    rating: formData.get('rating'),
    content: formData.get('content')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to post review: missing required info'
  };

  const { reviewer, product, title, rating, content } = validatedFields.data;
  const posted_at = date();
  try {
    const addResult = await sql`
      INSERT 
        INTO review ( reviewer, product, title, content, rating, posted_at )
        VALUES ( 
          ${reviewer}, 
          ${product}, 
          ${title}, 
          ${content}, 
          ${rating}, 
          ${posted_at}
        )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the review failed to be posted' };
  }
}
export async function updateReview(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateReview.safeParse({
    id: id,
    reviewer: formData.get('reviewer'),
    product: formData.get('product'),
    title: formData.get('title'),
    rating: formData.get('rating'),
    posted_at: formData.get('posted_at'),
    content: formData.get('content')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update review: missing required info'
  };

  const { reviewer, product, title, content, rating, posted_at } = validatedFields.data;
  const postedAt = dateFrom(posted_at);
  try {
    await sql`
      UPDATE review 
        SET reviewer  = ${reviewer}, 
            product   = ${product}, 
            title     = ${title}, 
            content   = ${content}, 
            rating    = ${rating}, 
            posted_at = ${postedAt}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the review failed to be updated' };
  }
}
export async function deleteReview(id: number) {
  try {
    await sql`DELETE FROM image AS i JOIN review_image AS r ON i.id = r.image WHERE r.id = ${id}`;
    await sql`DELETE FROM review_image WHERE `;
    await sql`DELETE FROM review WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the review failed to be deleted'}
  }
}
//#endregion

//#region order
export async function createOrder(prevState: State, formData: FormData) {
  const validatedFields = CreateOrder.safeParse({
    seller: formData.get('seller'),
    buyer: formData.get('buyer')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to add order: missing required info'
  };

  const { seller, buyer } = validatedFields.data;

  try {
    const addResult = await sql`
      INSERT 
        INTO order ( seller, buyer )
        VALUES ( ${seller}, ${buyer} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the order failed to be added' };
  }
}
export async function updateOrder(id: string, formData: FormData) {
  const validatedFields = UpdateOrder.safeParse({
    id: id,
    seller: formData.get('seller'),
    buyer: formData.get('buyer'),
    payed_at: formData.get('payed_at')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update order: missing required info'
  };

  const { seller, buyer, payed_at } = validatedFields.data;
  const payedAt = dateFrom(payed_at);

  try {
    await sql`
      UPDATE order 
        SET seller   = ${seller}, 
            buyer    = ${buyer},
            payed_at = ${payedAt}
        WHERE id = ${id}
    `;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the order failed to be updated' };
  }
}
export async function deleteOrder(id: number) {
  try {
    await sql`DELETE FROM order WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the order failed to be deleted'}
  }
}
//#endregion

//#region tag
export async function createTag(prevState: State, formData: FormData) {
  const validatedFields = CreateTag.safeParse({
    title: formData.get('title')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to add tag: missing required info'
  };

  const { title } = validatedFields.data;

  try {
    const addResult = await sql`
      INSERT 
        INTO image ( title )
        VALUES ( ${title} )
        RETURNING *
    `;
    return addResult[0];
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the tag failed to be added' };
  }
}
export async function updateTag(id: string, prevState: ImageState, formData: FormData) {
  const validatedFields = UpdateTag.safeParse({
    id: id,
    title: formData.get('title')
  });

  if (!validatedFields.success) return {
    errors: z.treeifyError(validatedFields.error).errors,
    message: 'Unable to update tag: missing required info'
  };

  const { title } = validatedFields.data;

  try {
    await sql`UPDATE tag SET title = ${title} WHERE id = ${id}`;
  } catch (e) {
    console.error(e);
    return { message: 'An internal error occured and the tag failed to be updated' };
  }
}
export async function deleteTag(id: number) {
  try {
    await sql`DELETE FROM product_has_tag WHERE tag = ${id}`;
    await sql`DELETE FROM tag WHERE id = ${id}`;
  }
  catch (e) {
    console.error(e);
    return {message: 'An internal error occured and the tag failed to be deleted'}
  }
}
//#endregion
