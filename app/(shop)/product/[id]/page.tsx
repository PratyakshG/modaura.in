"use client";

import { Image } from "@imagekit/next";
import { MdCancel, MdLocalShipping } from "react-icons/md";

import { FAQs } from "@/constants/data";

import AddToCartButton from "@/components/AddToCartButton";
import Popular from "@/components/layout/Popular";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { productTypes } from "@/types/index";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import mongoose from "mongoose";
import { use, useEffect, useState } from "react";
import { BiSolidOffer } from "react-icons/bi";

const Page = ({
  params,
}: {
  params: Promise<{ id: mongoose.Types.ObjectId }>;
}) => {
  const { id } = use(params);
  // const { cart, updateQuantity } = useCartStore();
  // const session = useSession();
  const [product, setProduct] = useState<productTypes>();

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    async function getProduct() {
      const res = await fetch(`/api/products?id=${id}`);
      const data = await res.json();

      setProduct(data);
    }
    getProduct();
  }, [id]);

  // const handleUpdateCart = async () => {
  //   if (session.data?.user) {
  //     //retrieve the latest cart state to remove the delay in updation to the API
  //     const cart = useCartStore.getState().cart;

  //     await fetch("/api/cart", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ cartItems: cart }),
  //     });
  //   }
  //   console.log(cart);
  // };

  return (
    <>
      <div className="w-full md:h-[600px] max-sm:flex-col flex items-start lg:justify-between relative overflow-scroll mt-5 gap-5 xl:gap-10">
        {/* Images of the product */}
        <div className="w-full sm:max-w-max sm:sticky sm:top-0">
          <div className="w-full flex max-lg:flex-col-reverse max-lg:gap-2 lg:space-x-2.5">
            <div className="flex lg:flex-col space-x-2 xl:space-y-2 overflow-scroll">
              {product?.images.map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  loading="lazy"
                  alt="product image"
                  width={300}
                  height={300}
                  className="object-cover aspect-square cursor-pointer size-16 lg:size-20"
                  onMouseEnter={() => {
                    api?.scrollTo(index, true);
                  }}
                />
              ))}
            </div>

            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "center",
              }}
              plugins={[WheelGesturesPlugin()]}
              className="size-full xl:w-[540px] aspect-square overflow-hidden"
            >
              <CarouselContent className="-ml-0 aspect-square">
                {product?.images.map((image, index) => (
                  <CarouselItem className="pl-0 basis-full" key={index}>
                    <Image
                      loading="lazy"
                      key={index}
                      src={image}
                      alt="product image"
                      width={300}
                      height={300}
                      className="object-cover aspect-square size-full xl:w-[540px]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* <Image
              src={displayImage}
              alt="Product Image"
              className="object-cover aspect-square max-md:size-full xl:size-[540px]"
            /> */}
          </div>
        </div>

        {/* Description of the product */}
        <div className="w-full flex flex-col space-y-3 lg:space-y-5">
          <ul className="*:tracking-wide space-y-2 lg:space-y-5">
            <li className="flex flex-col">
              <span className="font-medium text-2xl lg:text-4xl capitalize tracking-tight">
                {product?.name}
              </span>
              <span className="text-sm lg:text-base text-neutral-500">
                {product?.description}
              </span>
            </li>
            <li className="font-medium">No Reviews</li>
            <li className="font-bold flex items-baseline space-x-3">
              <span className="text-black-1 text-2xl">
                Rs. {product?.price.sellingPrice}
              </span>
              <span className="text-darkTeal text-lg line-through">
                Rs. {product?.price.mrp}
              </span>
            </li>
          </ul>

          {/* Quantity of the product */}
          {/* <div className="w-full flex h-full *:border *:border-darkTeal">
            <button
              className="h-10 w-10 flex items-center justify-center bg-darkTeal text-ivory rounded-l"
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              <RiSubtractLine size={20} />
            </button>

            <span className="px-6 py-2 h-10 w-20 text-center">{quantity}</span>

            <button
              className="h-10 w-10 flex items-center justify-center bg-darkTeal text-ivory rounded-r"
              onClick={() => {
                setQuantity(quantity + 1);
              }}
            >
              <IoMdAdd size={20} />
            </button>
          </div> */}

          <div className="w-full">
            {product && (
              <AddToCartButton
                _id={product?._id}
                name={product.name}
                category={""}
                description={""}
                price={{
                  mrp: 0,
                  sellingPrice: 0,
                }}
                images={[]}
                details=""
              />
            )}

            {/* <CallToActionBtn
              text="Add To Wishlist"
              className="w-full bg-ivory border-2 border-darkTeal py-3 text-darkTeal font-semibold uppercase tracking-wide rounded-md flex gap-2 "
              variant="default"
            >
              <IoMdHeart size={20} />
            </CallToActionBtn> */}
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <span className="w-full flex gap-2 items-center justify-center py-2 rounded-t-md font-medium text-ivory bg-darkTeal">
              <BiSolidOffer size={20} /> Available Offers
            </span>
            <ul className="w-full flex flex-col *:py-2 border border-darkTeal rounded-b-md *:border-b *:border-darkTeal *:last:border-b-0">
              <li className="text-sm text-center">
                <h5>
                  Flat <span className="font-bold">10 %</span> off on purchases
                  over Rs. 1499/-
                </h5>
              </li>
              <li className="text-sm text-center">
                <h5>
                  Free <span className="font-bold">delivery</span> on purchases
                  over Rs. 999/-
                </h5>
              </li>
            </ul>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="font-semibold text-lg">Product Details</h3>
            <p className="text-sm tracking-wide">{product?.details}</p>
          </div>

          <Accordion
            type="multiple"
            className="space-y-2 *:border *:border-neutral-400 *:rounded-md"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <MdCancel size={20} className="text-red-600" />
                  <span className="font-semibold">
                    Exchange / Return Policies
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Exchange or Returns are valid to 7 days from the date of
                delivery.
              </AccordionContent>
              <AccordionContent>
                Read our Refund Policy for more information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <MdLocalShipping size={20} className="text-darkTeal" />
                  <span className="font-semibold">Shipping & Returns</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                All orders will be delivered within 3 - 7 business days.
                <br />
                (Depending on the location.)
              </AccordionContent>
              <AccordionContent>
                Shipping or Delivery Charges are non-refundable in all cases.
              </AccordionContent>
              <AccordionContent>
                As soon as your order is processed, you will recieve a link to
                track you order.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="w-full">
        <Popular />
      </div>

      {/* FAQs */}
      <div className="xl:w-1/2">
        <h1 className="font-semibold text-lg">Frequently Asked Questions</h1>

        <Accordion
          type="multiple"
          className="space-y-2 *:border-b *:border-neutral-400"
        >
          {FAQs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex-row-reverse justify-end">
                <span className="font-medium">{faq.query}</span>
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
};

export default Page;
