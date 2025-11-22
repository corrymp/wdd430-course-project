import type { Seller } from "@/app/lib/types";
import Gallery from "@/app/ui/gallery";
import Image from "next/image";

function SellerItem({ seller }: { seller: Seller; }) {
  return (
    <>
      <Image
        className="home-seller-image"
        src={seller.shopBanner}
        alt={`shop banner for ${seller.shopName}`}
        width={200}
        height={150}
      />
      <p className="home-seller-shop">{seller.shopName}</p>
      <p className="home-seller-name">by <i>{seller.name}</i></p>
      <p className="home-seller-joined">joined {seller.joinDate.toLocaleDateString()}</p>
      <p className="home-seller-loc">from {seller.location}</p>
    </>
  );
}

export default function SellerList({sellers}: {sellers: Seller[]}) {
  return (
    <Gallery
      classes="home-seller-gallery"
      items={sellers.map(seller => (
        <SellerItem seller={seller} key={seller.id} />
      ))}
    />
  );
}
