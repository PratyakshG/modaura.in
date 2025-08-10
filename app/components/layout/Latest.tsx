"use client";

import useProductStore from "@/app/stores/useProductStore";
import { latestProducts } from "@/constants/data";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import ProductCard from "../product/ProductCard";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

const Latest = () => {
  const { products } = useProductStore();

  const items = products.filter((product) =>
    latestProducts.includes(product._id.toString())
  );

  return (
    <section className="w-full">
      <div
        id="latest-section"
        className="w-full flex flex-col space-y-3 lg:space-y-8"
      >
        <h3 className="text-xl lg:text-5xl text-center tracking-tighter">
          <span className="font-semibold">Latest</span> Collection
        </h3>
        <div className="lg:w-full flex">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            plugins={[WheelGesturesPlugin()]}
            className="w-full"
          >
            <CarouselContent className="lg:w-full h-full lg:justify-between -ml-0">
              {items.map((item, index) => (
                <CarouselItem className="pl-0" key={index}>
                  <ProductCard
                    _id={item._id}
                    name={item.name}
                    images={item.images}
                    price={item.price}
                    category=""
                    description=""
                    details=""
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Latest;
