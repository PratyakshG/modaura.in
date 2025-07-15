"use client";

import useProductStore from "@/app/stores/useProductStore";
import ProductCard from "@/components/product/ProductCard";
import React, { use } from "react";

const CategoryProduct = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { products } = useProductStore();

  const items = products.filter(
    (product) => product.category.toUpperCase() === id.toUpperCase()
  );

  return (
    <main className="w-full h-full space-y-5 lg:space-y-10">
      <h3 className="text-3xl lg:text-5xl capitalize">{id}s</h3>

      <div className="w-full text-end lg:text-lg">{items.length} products</div>

      <div className="grid grid-cols-2 lg:grid-cols-5 items-center justify-items-center gap-5 lg:gap-10">
        {items.map((item) => (
          <ProductCard
            key={item._id.toString()}
            _id={item._id}
            name={item.name}
            images={item.images}
            price={item.price}
            category={""}
            description={""}
          />
        ))}
      </div>

      <div className="">
        Stay Tuned With Us. We are bringing a lot of new collections and items.
      </div>
    </main>
  );
};

export default CategoryProduct;
