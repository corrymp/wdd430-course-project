import { Id, Product, Seller, Tag, User } from "./types";
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
  'Girly',
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
  'Amulet',
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

//#endregion

//#region utils

/**
 * @param {Function} fn - returns an item for the list 
 * @param {number?} count - total number of items in the list. Defaults to 10 
 * @param {Id[]} ids - pre-set list of IDs to use. Increments if not provided. 
 * @returns {Object[]} list of `count` length filled with the return items from `fn`
 */
const makeList = <L>(fn: (id?: Id) => L, count?: number, ids: Id[] = []): Array<L> => Array.from({ length: abs(Number(count ?? 10)) }, (i: number) => fn(ids[i]));

const randomItemFromList = <T>(list: Array<T>, force?: number): T => list[floor(force ?? random() * list.length)];

const optionedTemplate = (tmp: ReadonlyArray<string>, ...keys: ReadonlyArray<Array<string>>) => tmp[0] + keys.map((key: string[], i) => randomItemFromList(key) + tmp[i + 1]).join('');

const randomInRange = (lo: number, hi: number) => lo + floor(random() * (floor(hi) - ceil(lo) + 1));
//#endregion

//#region ids
const newIdGenerator = (firstId?: number) => (g => () => g.next().value)(function*(i) { while (true) yield i++; }(firstId ?? 42));
const tagId = newIdGenerator();
const sellerId = newIdGenerator();
const userId = newIdGenerator();
const productId = newIdGenerator();
//#endregion

//#region randoms
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
  optionedTemplate`${vibe} ${adjective}`,
  optionedTemplate`${vibe} ${material}`,
  optionedTemplate`${adjective} ${material}`,
  optionedTemplate`${adjective} ${noun}`,
  optionedTemplate`${adjective} ${vibe}`,
  optionedTemplate`${material} ${adjective}`,
  optionedTemplate`${material} ${noun}`,
  optionedTemplate`${material} ${vibe}`,
]);

const randomDate = () => new Date(randomInRange(Date.parse('2025-10-27'), Date.now()));

//#endregion

//#region singular
export const mockTag = (id?: Id): Tag => ({ id: id ?? tagId(), title: randomTagTitle() });

export const mockSeller = (id?: Id): Seller => ({
  id: id ?? sellerId(),
  name: randomFullName(),
  location: 'Anyville, Idaforniah',
  picture: placeholderImage(200, 200),
  joinDate: randomDate(),
  shopName: randomShopName(),
  shopBanner: placeholderImage(200,150)
});

export const mockUser = (id?: Id): User => ({ id: id ?? userId(), name: randomFullName(), picture: 'example.com/pfp.png' });

export const mockProduct = (id?: Id): Product => ({
  id: id ?? productId(),
  sellerId: random(),
  name: randomProductName(),
  price: randomInRange(10, 100),
  tags: Array.from({ length: randomInRange(1, 5) }, mockTag),
  images: Array.from({ length: randomInRange(1, 4) }, () => placeholderImage(150, 150))
});
//#endregion

//#region multiple
export const mockTagsList = (count?: number, ids?: Id[]): Tag[] => makeList(mockTag, count, ids);
export const mockSellerList = (count?: number, ids?: Id[]): Seller[] => makeList(mockSeller, count, ids);
export const mockUsersList = (count?: number, ids?: Id[]): User[] => makeList(mockUser, count, ids);
export const mockProductsList = (count?: number, ids?: Id[]): Product[] => makeList(mockProduct, count, ids);
//#endregion

export function placeholderImage(width: number, height: number): string {
  return `data:image/svg+xml,
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E
 <rect width="100%25" height="100%25" fill="%23fff"/%3E
 <g stroke-width="10" stroke="%23aaa"%3E
  <rect width="100%25" height="100%25" fill="none"/%3E
  <g transform="translate(-5 -5)" stroke-width="5"%3E
   <line x1="10" y1="10" x2="100%25" y2="100%25"/%3E
   <line x1="100%25" y1="10" x2="10" y2="100%25"/%3E
  </g%3E
 </g%3E
</svg%3E`.split('\n').map(i => i.trim()).join('');
}

export function PlaceholderImage({ width, height }: { width: number; height: number; }) {
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: width, height: height },
      // <rect width="100%" height="100%" />
      React.createElement("rect", { width: "100%", height: "100%", fill: "#fff" }),
      // <g stroke-width="10" stroke="#aaa">
      React.createElement("g", { strokeWidth: 10, stroke: "#aaa" },
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