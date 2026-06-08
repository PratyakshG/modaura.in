import { Image } from "@imagekit/next";
import { ObjectId } from "mongoose";
import Link from "next/link";
import AddToCartButton from "../../components/AddToCartButton";
// import { IoMdHeartEmpty } from "react-icons/io";

type productCardTypes = {
  _id: ObjectId;
  name: string;
  price: {
    mrp: number;
    sellingPrice: number;
  };
  images: string[];
};

const ProductCard = ({ _id, name, price, images }: productCardTypes) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-1 lg:space-y-2">
      <Link
        href={`/product/${_id}`}
        className="w-full h-full flex flex-col items-center justify-center space-y-1 lg:space-y-2"
      >
        <div className="h-full w-full bg-neutral-200 overflow-clip cursor-pointer transition-all duration-200 ease-in-out relative aspect-square rounded-md">
          {/* image of the product */}
          <Image
            src={images && images[0]}
            alt="product"
            width={300}
            height={300}
            loading="lazy"
            className={`object-cover transition-all hover:scale-150 duration-300 ease-in-out h-full w-full`}
          />

          {/* wishlist feature */}
          {/* <IoMdHeartEmpty className="absolute right-2 top-2 lg:right-5 lg:top-5 border hover:border-darkTeal size-6 p-1.5 lg:size-8 rounded-full bg-white text-darkTeal hover:bg-darkTeal hover:text-white transition-all duration-200" /> */}
        </div>

        <div className="w-full flex flex-col text-left">
          {/* title of the product */}
          <h3 className="text-xs lg:text-sm lg:leading-tight truncate capitalize">
            {name ? name : "Product Name"}
          </h3>

          {/* cost of the product */}
          <div className="flex items-baseline space-x-1 lg:space-x-2 leading-tight">
            <h2 className="font-bold text-sm">
              {price?.sellingPrice
                ? `Rs. ${price.sellingPrice}`
                : "Selling Price"}
            </h2>
            <h3 className="text-sm line-through text-neutral-600">
              {price?.mrp ? `Rs. ${price.mrp}` : "Cost Price"}
            </h3>
          </div>
        </div>
      </Link>

      {/* Add to cart button */}
      <AddToCartButton
        _id={_id}
        name={name}
      />
    </div>
  );
};

export default ProductCard;
