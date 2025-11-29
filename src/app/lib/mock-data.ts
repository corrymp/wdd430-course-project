import {
  Id, 
  Url, 
  Image, ImageRow, ImageRows,  
  Tag, TagRow, TagRows, 
  User, UserRow, UserRows, 
  Shop, ShopRow, ShopRows, 
  Product, ProductRow, ProductRows, 
  Review, ReviewRow, ReviewRows, 
  Order, OrderRow, OrderRows, 
  OrderItem, ItemInOrderRow, ItemInOrderRows, 
  ReviewImageRow, ReviewImageRows, 
  ProductTagRow, ProductTagRows, 
  ProductImageRow,  ProductImageRows
} from "./types";

import React from "react";
const { random, abs, floor, ceil } = Math;

//#region preset lists

const tagTitles: string[] = [
  'Arts and Crafts',
  'Bags',
  'Birthdays',
  'Black',
  'Blue',
  'Brown',
  'Candles',
  'Cats',
  'Christmas',
  'Clothing',
  'Custom',
  'Cute',
  'Digital',
  'Dogs',
  'Eco',
  'Free Shipping',
  'Furnature',
  'Green',
  'Grey',
  'Halloween',
  'Hearts',
  'Housewarming',
  'Jewlery',
  'Keychain',
  'Minimalist',
  'Orange',
  'Paper',
  'Personalized',
  'Phone Case',
  'Pink',
  'Pottery',
  'Purple',
  'Red',
  'Shoes',
  'Shoes',
  'Stickers',
  'Trendy',
  'Unisex',
  'Vintage',
  'Wall Art',
  'White',
  'Yellow'
];

const firstNames: string[] = [
  'Adam', 'Abigail',
  'Benjamin', 'Bathsheba',
  'Caleb', 'Chloe',
  'Daniel', 'Deborah',
  'Ephraim', 'Elisabeth',
  'Frank', 'Flora',
  'Gideon', 'Grace',
  'Hezekiah', 'Hannah',
  'Isaiah', 'Ida',
  'Jacob', 'Joanna',
  'Lehi', 'Leah',
  'Michael', 'Miriam',
  'Nathan', 'Naomi',
  'Omer', 'Orpah',
  'Peter', 'Phoebe',
  'Reuben', 'Rebekah',
  'Samuel', 'Susanna',
  'Thomas', 'Tabitha',
  'Zacharias', 'Zipporah'
];

const lastNames: string[] = [
  'Anderson',
  'Baker',
  'Campbell',
  'Davis',
  'Edwards',
  'Fisher',
  'Gomez',
  'Harris',
  'Irvine',
  'Johnson',
  'Knight',
  'Larkin',
  'Martinez',
  'Nelson',
  'Oaks',
  'Palmer',
  'Quincey',
  'Rasband',
  'Smith',
  'Taylor',
  'Uchtdorf',
  'Vargas',
  'Waddell',
  'Xavier',
  'Young',
  'Zwick'
];

const adjective: string[] = [
  'Artisan',
  'Charming',
  'Cozy',
  'Dawn',
  'Delicate',
  'Dreamy',
  'Dusk',
  'Earthy',
  'Enchanted',
  'Ethical',
  'Garden-Fresh',
  'Hand-Stitched',
  'Heartfelt',
  'Heirloom',
  'Inspired',
  'Mindful',
  'Moonlit',
  'Organic',
  'Petal-Soft',
  'Rustic',
  'Soulful',
  'Starlight',
  'Sunny',
  'Sustainable',
  'Vintage',
  'Whimsical',
  'Whisper-Quiet'
];

const material: string[] = [
  'Botanical',
  'Carved',
  'Ceramic',
  'Clay',
  'Cotton',
  'Crochet',
  'Embroidered',
  'Felt',
  'Gemstone',
  'Glazed',
  'Herbal',
  'Knit',
  'Leather',
  'Linen',
  'Paper',
  'Pottery',
  'Pressed',
  'Resin',
  'Seed Bead',
  'Spice',
  'Wood',
  'Wool',
  'Woven'
];

const noun: string[] = [
  'Beanie',
  'Blanket',
  'Bookmark',
  'Bracelet',
  'Candle',
  'Coaster',
  'Cuff',
  'Earrings',
  'Journal',
  'Mobile',
  'Mug',
  'Necklace',
  'Notebook',
  'Pillow',
  'Plant Box',
  'Planter',
  'Print',
  'Scarf',
  'Soap',
  'Stash Box',
  'Stationery',
  'Sticker Set',
  'Sticker Sheet',
  'Tapestry',
  'Throw',
  'Tote Bag',
  'Trinket Dish',
  'Wall Hanging',
  'Wrap'
];

const vibe: string[] = [
  'Aura',
  'Bloom',
  'Blossom',
  'Charm',
  'Delight',
  'Essence',
  'Fable',
  'Fireside',
  'Gathering',
  'Glimmer',
  'Grove',
  'Haven',
  'Hearth',
  'Kindred',
  'Lullaby',
  'Meadow',
  'Nook',
  'Petals',
  'Sanctuary',
  'Spark',
  'Treasures',
  'Whispers'
];

const joiner: string[] = ['of', 'for the', 'with'];

const USStates: string[] = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

const totallyRealCityNames: string[] = [
  'Anywhere',
  'Bradford',
  'Brookside',
  'Centerville',
  'Clayton',
  'Clearwater',
  'Concordia',
  'Eastbrook',
  'Fairfax',
  'Fairview',
  'Freedom',
  'Glenwood',
  'Goodville',
  'Grandview',
  'Greenview',
  'Greenville',
  'Hampton',
  'Harmony',
  'Hopewell',
  'Jamison',
  'Kingston',
  'Lakeview',
  'Midway',
  'Northfield',
  'Nowhere',
  'Pine Ridge',
  'Plainfield',
  'Pleasanton',
  'Providence',
  'Red Bluff',
  'Riverbend',
  'Rockville',
  'Rosewood',
  'Shadowbrook',
  'Silverleaf',
  'Somerset',
  'Somewhere',
  'Springfield',
  'Twin Oaks',
  'Unionville',
  'Westbridge',
  'Wherever'
];

const mockProductImages: string[] = [
  '/images/ceramic-dishes.jpeg',
  "/images/cuckoo-clock.jpeg",
  '/images/faces.jpeg',
  '/images/fruit-basket.jpeg',
  "/images/necklace.jpeg",
  '/images/papercraft.jpeg',
  '/images/pot.jpeg',
  '/images/sandals.jpeg',
  '/images/terracotta-cups.jpeg',
  '/images/windchimes.jpeg',
  '/images/wooden-bracelet.jpeg',
  '/images/wooden-couple.jpeg',
  '/images/woven-basket.jpeg'
];

const fillColors: string[] = [
  '#f77',
  '#ff7',
  '#7f7',
  '#7ff',
  '#77f',
  '#f7f',
  '#077',
  '#007',
  '#707',
  '#700',
  '#070'
];
const strokeColors: string[] = [
  '#a77',
  '#aa7',
  '#7a7',
  '#7aa',
  '#77a',
  '#a7a',
  '#577',
  '#557',
  '#757',
  '#755',
  '#575'
];

const reviewText: string[] = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et nihil error quas, vel consectetur libero. Sunt, vero, alias reiciendis fugit corporis sint ullam quisquam expedita cumque repellendus doloribus iure repellat.
Tempora amet modi maiores inventore illum nesciunt sed, rerum aliquam reiciendis fuga nisi officiis enim asperiores ratione eveniet, quasi nobis cum. Doloremque labore vitae adipisci asperiores autem, voluptatum reiciendis assumenda!
Deleniti, eligendi perferendis in dolorum laudantium quisquam eum quod inventore soluta. Totam eveniet veniam corrupti fuga nostrum, ipsam rem molestiae facilis! Dicta, mollitia tenetur voluptatum quisquam ipsam velit natus doloribus?
Eum tenetur aliquam eius illo sequi labore praesentium voluptatibus numquam obcaecati similique, sapiente assumenda quia neque minus asperiores impedit in laudantium cumque optio ea doloribus. Reiciendis, eveniet rerum? Voluptates, consectetur!
Harum ipsum quo mollitia qui commodi dignissimos, aliquam reiciendis et cumque sed quisquam ducimus nisi sunt consequuntur officiis sequi optio vero quod deserunt veniam impedit? Laborum odit vero distinctio nostrum.
Id, neque incidunt nisi quam nobis voluptas obcaecati blanditiis laudantium nemo ad sapiente enim numquam labore quidem quibusdam possimus sint eveniet sunt! Blanditiis commodi veritatis iste eveniet voluptatibus ratione aspernatur?
Earum consectetur eum, doloribus veniam, fugiat eius, assumenda cupiditate autem corrupti odio voluptas. Impedit alias autem temporibus, nulla recusandae rerum maxime. Fugiat quasi rem nam enim, aperiam hic veniam! Nemo.
Fugiat magni facere perspiciatis nisi dolorem repellendus aliquam aut nostrum assumenda natus autem voluptas officiis, quis praesentium laboriosam reiciendis ut. Numquam ea blanditiis fugit assumenda. Tempore eum ducimus quia aspernatur!
Soluta quos necessitatibus temporibus itaque dolore! Doloremque tempora voluptate maxime sed nam recusandae, neque mollitia distinctio rerum asperiores ea inventore consequatur earum voluptatibus dolores repellendus, ex soluta expedita eligendi tempore.
Sed sint eaque odio laboriosam eos! Reprehenderit error nemo voluptas exercitationem ipsum natus quaerat nihil similique voluptatem minima consequuntur beatae voluptate tempore alias voluptates quod possimus necessitatibus, perferendis veniam sit?`.split('\n');


//#endregion

//#region utils

const mockCache = {
  image: new Map,
  item_in_order: new Map,
  order: new Map,
  product: new Map,
  product_has_tag: new Map,
  product_image: new Map,
  review: new Map,
  review_image: new Map,
  shop: new Map,
  tag: new Map,
  user: new Map
};

function checkCache(id: Id|string, path: 'image' | 'item_in_order' | 'order' | 'product' | 'product_has_tag' | 'product_image' | 'review' | 'review_image' | 'shop' | 'tag' | 'user', ifnot: Function) {
  if (mockCache[path].has(id)) return mockCache[path].get(id);
  mockCache[path].set(id, { id });
  const item = ifnot();
  mockCache[path].set(id, item);
  return item;
}

/**
 * @param {Function} fn - returns an item for the list 
 * @param {number?} count - total number of items in the list. Defaults to 10 
 * @param {Id[]} ids - pre-set list of IDs to use. Increments if not provided. 
 * @returns {Object[]} list of `count` length filled with the return items from `fn`
 */
const makeList = <L>(fn: (id?: Id) => L, count?: number, ids: Id[] = []): Array<L> => Array.from({ length: abs(Number(count ?? 10)) }, (i: number) => fn(ids[i]));

/**
 * @param {Array} list - array of items to pick from
 * @param {number} force - index to force a non-random selection
 * @returns random item from array
 */
const randomItemFromList = <T>(list: Array<T>, force?: number): T => list[floor(force ?? random() * list.length)];

/**
 * @param {Array<string>} tmp - template string to populate
 * @param {Array<Array<string>>} keys - arrays of items to pick a random item from to insert into the template
 * @returns {string} build string from template
 */
const optionedTemplate = (tmp: ReadonlyArray<string>, ...keys: ReadonlyArray<Array<string>>) => tmp[0] + keys.map((key: string[], i) => randomItemFromList(key) + tmp[i + 1]).join('');

/**
 * @param {number} lo - minimum number allowed
 * @param {number} hi - maximum number allowed
 * @returns {number} random integer within desired range
 */
const randomInRange = (lo: number, hi: number): number => lo + floor(random() * (floor(hi) - ceil(lo) + 1));

//#region placeholder image gen

// data URI version
/**
 * @param {number} width - width of placeholder image
 * @param {number} height - height of placeholder image
 * @param {string?} bg - background fill color; default: #fff
 * @param {string?} lines - lines stroke color; default: #aaa
 * @returns {string} data URI string for an SVG with desired width and height
 */
export function placeholderImage(width: number, height: number, bg?: string, lines?: string): string {
  if (bg && bg[0] === '#') bg = bg.slice(1);
  if (lines && lines[0] === '#') lines = lines.slice(1);
  return `data:image/svg+xml,
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E
 <rect width="100%25" height="100%25" fill="%23${bg ?? 'fff'}"/%3E
 <g stroke-width="10" stroke="%23${lines ?? 'aaa'}"%3E
  <rect width="100%25" height="100%25" fill="none"/%3E
  <g transform="translate(-5 -5)" stroke-width="5"%3E
   <line x1="10" y1="10" x2="100%25" y2="100%25"/%3E
   <line x1="100%25" y1="10" x2="10" y2="100%25"/%3E
  </g%3E
 </g%3E
</svg%3E`.split('\n').map(i => i.trim()).join('');
}

// React element version (pre-compiled as this is not a JSX file)
/**
 * @param {JSX.Element.props} props
 * @param {number} props.width - width of placeholder SVG
 * @param {number} props.height - height of placeholder SVG
 * @param {string?} props.bg - background fill color; default: #fff
 * @param {string?} props.lines - lines stroke color; default: #aaa
 * @returns {JSX.Element} React element SVG with desired width and height
 */
export function PlaceholderImage({ width, height, bg, lines }: { width: number; height: number; bg?: string; lines?: string; }): React.ReactSVGElement {
  if (bg && bg[0] === '#') bg = bg.slice(1);
  if (lines && lines[0] === '#') lines = lines.slice(1);
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height },
      // <rect width="100%" height="100%" />
      React.createElement("rect", { width: "100%", height: "100%", fill: bg ?? "#fff" }),
      // <g stroke-width="10" stroke="#aaa">
      React.createElement("g", { strokeWidth: 10, stroke: lines ?? "#aaa" },
        // <rect width="100%" height="100%" fill="none" />
        React.createElement("rect", { width: "100%", height: "100%", fill: "none" }),
        // <g stroke-width="5" transform="translate(-5 -5)">
        React.createElement("g", { transform: "translate(-5 -5)", strokeWidth: 5 },
          // <line x1="10" y1="10" x2="100%" y2="100%"/>
          React.createElement("line", { x1: 10, y1: 10, x2: "100%", y2: "100%" }),
          // <line x1="100%" y1="10" x2="10" y2="100%"/>
          React.createElement("line", { x1: "100%", y1: 10, x2: 10, y2: "100%" })
        )
        // </g>
      )
      // </g>
    )
    // </svg>
  );
}
//#endregion

//#endregion

//#region ids
const newIdGenerator = (firstId?: number) => (g => () => g.next().value)(function*(i) { while (true) yield i++; }(firstId ?? 42));

const newId = (firstId?: number, existing?: Array<number>): { next: () => number; any: () => number; } => {
  const ids: Array<number> = existing ?? [];
  const getNext = newIdGenerator(firstId);
  return {
    next() {
      const id = getNext();
      ids.push(id);
      return id;
    },
    any: () => randomItemFromList(ids)
  };
};

const imageId = newId();
const userId = newId();
const shopId = newId();
const productId = newId();
const reviewId = newId();
const orderId = newId();
const tagId = newId();
//#endregion

//#region random names and such
const randomTagTitle = (firstId?: number): string => randomItemFromList(tagTitles, firstId);
const randomFirstName = (firstId?: number) => randomItemFromList(firstNames, firstId);
const randomLastName = (firstId?: number) => randomItemFromList(lastNames, firstId);
const randomFullName = (id1?: number, id2?: number) => `${randomFirstName(id1)} ${randomLastName(id2 ?? id1)}`;

const randomProductName = (): string => randomItemFromList([
  optionedTemplate`${material} ${material} ${noun}`,
  optionedTemplate`${material} ${noun} ${joiner} ${adjective} ${vibe}`,
  optionedTemplate`${adjective} ${material} ${noun}`,
  optionedTemplate`${adjective} ${material} ${joiner} ${vibe}`,
  optionedTemplate`${adjective} ${noun}`,
  optionedTemplate`${vibe} ${noun} (${material})`,
  optionedTemplate`${vibe} ${joiner} ${material} ${noun}`,
  optionedTemplate`${vibe} ${material} ${noun}`,
  optionedTemplate`${vibe} ${vibe} ${material} ${material}`,
]);

const randomShopName = () => randomItemFromList([
  optionedTemplate`${adjective} ${noun}`,
  optionedTemplate`${adjective} ${vibe}`,
  optionedTemplate`${material} ${noun}`,
  optionedTemplate`${material} ${vibe}`,
]);

const randomDate = () => new Date(randomInRange(Date.parse('2024-10-27'), Date.now()));

const randomState = (): string => randomItemFromList(USStates);
const randomTotallyRealCity = (): string => randomItemFromList(totallyRealCityNames);
const randomPlace = (): string => `${randomTotallyRealCity()}, ${randomState()}`;

const randomPlaceholderImage = (width: number, height: number): Image => {
  const img = {
    id: imageId.next(),
    width,
    height,
    path: placeholderImage(width, height, randomItemFromList(fillColors), randomItemFromList(strokeColors)),
    alt_text: 'Placeholder'
  };
  mockCache.image.set(img.id, img);
  return img;
};
//#endregion

//#region singular

export const mockImage = (id: Id = imageId.next()): ImageRow => checkCache(id, 'image', () => ({id,path: randomItemFromList(mockProductImages),width: 100,height: 100,alt_text: 'Placeholder'}));

export const mockUser = (id: Id = userId.next()): UserRow => checkCache(id, 'user', () => ({id,name: randomFullName(),join_date: randomDate(),pfp: randomPlaceholderImage(128, 128).id}));

export const mockShop = (id: Id = shopId.next(), ownerId?: Id): ShopRow => checkCache(id, 'shop', () => ({id,manager: mockUser(ownerId).id,location: randomPlace(),name: randomShopName(),banner: randomPlaceholderImage(200, 150).id}));

export const mockProduct = (id: Id = productId.next()): ProductRow => checkCache(id, 'product', () => {
  Array.from({ length: randomInRange(1, 5) }, () => mockProductTag(id, tagId.any()));
  Array.from({ length: randomInRange(1, 4) }, () => mockProductImage(id, mockImage().id));
  return {
    id,
    shop: mockShop(shopId.any()).id,
    name: randomProductName(),
    price: randomInRange(10, 100) - .01,
    listed_at: randomDate()
  };
});

export const mockReview = (id: Id = reviewId.next()): ReviewRow => checkCache(id, 'review', () => {
  Array.from({ length: randomInRange(0, 2) }, () => mockReviewImage(id, mockImage().id));
  const revText = Array.from({ length: randomInRange(1, 3) }, () => randomItemFromList(reviewText)).join(' ');
  return {
    id,
    reviewer: mockUser(userId.any()).id,
    product: mockProduct(productId.any()).id,
    title: revText.split(' ').slice(0, randomInRange(2, 5)).join(' '),
    content: revText,
    rating: randomInRange(1, 5)
  };
});

export const mockTag = (id: Id = tagId.next()): TagRow => checkCache(id, 'tag', () => ({id,title: randomTagTitle()}));

export const mockOrder = (id: Id = orderId.next()): OrderRow => checkCache(id, 'order', () => {
  const items = Array.from({ length: randomInRange(1, 3) }, () => mockOrderItem(id));
  const amount = parseFloat(items.reduce((ac, cur) => ac + mockProduct(cur.product).price * cur.quantity, 0).toFixed(2));
  return {
    id,
    buyer: mockUser(userId.any()).id,
    payed_at: randomItemFromList([null, randomDate(), randomDate(), randomDate()]),
    amount
  };
});

export const mockOrderItem = (id: Id = orderId.any(), item?: Id): ItemInOrderRow => checkCache(id, 'item_in_order', () => ({
  order: id,
  item: mockProduct(item).id,
  quantity: randomInRange(1, 3)
}));

export const mockReviewImage = (rev: Id = reviewId.next(), img?: Id): ReviewImageRow => checkCache(`${rev}|${img}`, 'review_image', () => ({ 
  review: mockReview(rev).id, 
  image: mockImage(img).id 
}));

export const mockProductTag = (prod: Id = productId.any(), tag: Id = tagId.any()): ProductTagRow => checkCache(`${prod}|${tag}`, 'product_has_tag', () => ({ 
  product: mockProduct(prod).id, 
  tag: mockTag(tag).id 
}));

export const mockProductImage = (prod: Id = productId.any(), img: Id = imageId.any()): ProductImageRow => checkCache(`${prod}|${img}`, 'product_image', () => ({ 
  product: mockProduct(prod).id, 
  image: mockImage(img).id 
}));

//#endregion

//#region plural
export const mockImageList = (count?: number, ids?: Id[]): ImageRows => makeList(mockImage, count, ids);
export const mockUsersList = (count?: number, ids?: Id[]): UserRows => makeList(mockUser, count, ids);
export const mockShopsList = (count?: number, ids?: Id[]): ShopRows => makeList(mockShop, count, ids);
export const mockProductsList = (count?: number, ids?: Id[]): ProductRows => makeList(mockProduct, count, ids);
export const mockReviewsList = (count?: number, ids?: Id[]): ReviewRows => makeList(mockReview, count, ids);
export const mockReviewImagesList = (count?: number, ids?: Id[]): ReviewImageRows => makeList(mockReviewImage, count, ids);
export const mockTagsList = (count?: number, ids?: Id[]): TagRows => makeList(mockTag, count, ids);
export const mockOrdersList = (count?: number, ids?: Id[]): OrderRows => makeList(mockOrder, count, ids);
export const mockOrderItemsList = (count?: number, ids?: Id[]): ItemInOrderRows => makeList(mockOrderItem, count, ids);
export const mockProductTagsList = (count?: number, ids?: Id[]): ProductTagRows => makeList(mockProductTag, count, ids);
export const mockProductImagesList = (count?: number, ids?: Id[]): ProductImageRows => makeList(mockProductImage, count, ids);
//#endregion
