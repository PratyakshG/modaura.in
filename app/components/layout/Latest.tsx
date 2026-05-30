"use client";

import useProductStore from "@/app/stores/useProductStore";
import { latestProducts } from "@/constants/data";
import ProductCard from "../product/ProductCard";

const Latest = () => {
  const { products } = useProductStore();

  const items = products.filter((product) =>
    latestProducts.includes(product._id.toString()),
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

        <div className="self-center grid grid-cols-2 lg:grid-cols-4 gap-5 lg:mt-6">
          {items.slice(0, 4).map((item) => (
            <ProductCard
              key={item._id.toString()}
              _id={item._id}
              name={item.name}
              images={item.images}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Latest;
