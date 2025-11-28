import { Id, Url, Product, Shop, Tag, User, Image, Review, Order, OrderItem } from "./types";
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

//#endregion

//#region utils

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

//#endregion

//#region singular

export const mockImage = (id?: Id): Image => ({
  id: id ?? imageId.next(),
  path: randomItemFromList(mockProductImages),
  width: 100,
  height: 100,
  alt_text: 'Placeholder'
});

export const mockUser = (id?: Id): User => ({
  id: id ?? userId.next(),
  name: randomFullName(),
  join_date: randomDate(),
  pfp: 'example.com/pfp.png'
});

export const mockShop = (id?: Id, ownerId?: Id): Shop => ({
  id: id ?? shopId.next(),
  manager: ownerId ?? userId.any(),
  location: randomPlace(),
  name: randomShopName(),
  banner: placeholderImage(200, 150)
});

export const mockProduct = (id?: Id): Product => ({
  id: id ?? productId.next(),
  shop: shopId.any(),
  name: randomProductName(),
  price: randomInRange(10, 100),
  tags: Array.from({ length: randomInRange(1, 5) }, mockTag),
  images: Array.from({ length: randomInRange(1, 4) }, mockImage),
  listed_at: randomDate()
});

export const mockReview = (id?: Id): Review => ({
  id: id ?? reviewId.next(),
  reviewer: userId.any(),
  product: productId.any(),
  title: 'mock review',
  content: 'mock review',
  rating: 3,
  images: Array.from({ length: randomInRange(0, 2) }, mockImage)
});

export const mockTag = (id?: Id): Tag => ({
  id: id ?? tagId.next(),
  title: randomTagTitle()
});

export const mockOrder = (id?: Id): Order => {
  const items = Array.from({ length: randomInRange(1, 3) }, () => mockOrderItem());
  const amount = items.reduce((ac, cur) => ac + cur.item.price * cur.quantity, 0);
  return {
    id: id ?? orderId.next(),
    buyer: userId.any(),
    amount,
    payed_at: randomItemFromList([undefined, randomDate()]),
    items
  };
};

export const mockOrderItem = (id?: Id, item?: Product): OrderItem => ({
  order: id ?? orderId.any(),
  item: item ?? mockProduct(),
  quantity: randomInRange(1, 3)
});

//#endregion

//#region plural
export const mockTagsList = (count?: number, ids?: Id[]): Tag[] => makeList(mockTag, count, ids);
export const mockSellerList = (count?: number, ids?: Id[]): Shop[] => makeList(mockShop, count, ids);
export const mockUsersList = (count?: number, ids?: Id[]): User[] => makeList(mockUser, count, ids);
export const mockProductsList = (count?: number, ids?: Id[]): Product[] => makeList(mockProduct, count, ids);
//#endregion
