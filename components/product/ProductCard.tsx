"use client";

import useCartStore from "@/app/stores/useCartStore";
import { productTypes } from "@/models/Product";
// import displayImage from "@/public/products/product 1.jpg";
// import Image from "next/image";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { BiCart } from "react-icons/bi";
import { IoMdHeartEmpty } from "react-icons/io";
import CallToActionBtn from "../ui/callToActionBtn";
import { toast } from "sonner";

const ProductCard = ({ _id, name, price, images }: productTypes) => {
  const { addToCart } = useCartStore();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-1 lg:space-y-2">
      <Link
        href={`/product/${_id}`}
        className="w-full h-full flex flex-col items-center justify-center space-y-1 lg:space-y-2"
      >
        <div className="size-[calc(100dvw/2-30px)] md:size-[200px] lg:size-[250px] 2xl:size-[300px] bg-neutral-200 rounded-lg lg:rounded-xl overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out relative">
          {/* image of the product */}
          <Image
            src={images && images[0]}
            alt="product"
            width={300}
            height={300}
            responsive={false}
            loading="lazy"
            className={`object-cover transition-all hover:scale-120 duration-150 ease-in-out absolute`}
          />
          <IoMdHeartEmpty className="absolute right-2 top-2 lg:right-5 lg:top-5 border size-6 p-1 lg:size-8 rounded-full bg-white opacity-70 text-darkTeal hover:opacity-100 transition-all duration-200" />
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* title of the product */}
          <h3 className="text-sm lg:text-base lg:leading-tight font-light truncate">
            {name ? name : "Product Name"}
          </h3>
          {/* cost of the product */}
          <div className="flex items-baseline space-x-1 lg:space-x-2 leading-tight">
            <h2 className="font-bold text-sm lg:text-lg">
              {price?.sellingPrice
                ? `Rs. ${price.sellingPrice}`
                : "Selling Price"}
            </h2>
            <h3 className="text-xs lg:text-base line-through text-neutral-600">
              {price?.mrp ? `Rs. ${price.mrp}` : "Cost Price"}
            </h3>
          </div>
        </div>
      </Link>

      {/* Add to cart button */}
      <CallToActionBtn
        text="Add to Cart"
        onClick={() => {
          addToCart(_id);
          toast(`${name} is added to cart.`);
        }}
        className="w-full flex items-center justify-center gap-2 bg-darkTeal text-ivory rounded-lg lg:rounded-xl py-3 lg:py-3 lg:px-4 hover:opacity-90 transition-all duration-200 ease-in-out"
      >
        <BiCart size={16} />
      </CallToActionBtn>
    </div>
  );
};

export default ProductCard;
