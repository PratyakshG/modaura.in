"use client";

import useProductStore from "@/app/stores/useProductStore";
import { popularProducts } from "@/constants/data";
import ProductCard from "../product/ProductCard";

const Popular = () => {
  const { products } = useProductStore();

  const items = products.filter((product) =>
    popularProducts.includes(product._id.toString()),
  );
  return (
    <section
      className="w-full"
      id="popular-section"
    >
      <div className="w-full flex flex-col space-y-3 lg:space-y-10">
        <h3 className="text-3xl lg:text-5xl text-center tracking-tighter">
          <span className="font-semibold">Popular</span> Collection
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

export default Popular;
