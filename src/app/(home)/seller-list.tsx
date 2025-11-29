import type { Shop } from "@/app/lib/types";
import Gallery from "@/app/ui/gallery";
import Image from "next/image";

function SellerItem({ shop }: { shop: Shop; }) {
  const seller = shop.manager;
  return (
    <>
      <Image
        className="home-seller-image"
        src={shop.banner.path}
        alt={shop.banner.alt_text}
        width={shop.banner.width}
        height={shop.banner.height}
      />
      <p className="home-seller-shop">{shop.name}</p>
      <p className="home-seller-name">by <i>{seller.name}</i></p>
      <p className="home-seller-joined">joined {seller.join_date.toLocaleDateString()}</p>
      <p className="home-seller-loc">from {shop.location}</p>
    </>
  );
}

export default function SellerList({ sellers }: { sellers: Shop[]; }) {
  return (
    <Gallery
      classes="home-seller-gallery"
      items={sellers.map(seller => (
        <SellerItem shop={seller} key={seller.id} />
      ))}
    />
  );
}
