"use client";

import useProductStore from "@/app/stores/useProductStore";
import ProductCard from "../../components/product/ProductCard";
import { productTypes } from "@/types/index";
import React, { use, useEffect, useState } from "react";

const CategoryProduct = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { products } = useProductStore();
  const [data, setData] = useState<Array<productTypes>>([]);

  useEffect(() => {
    const items = products.filter(
      (product) => product.category.toUpperCase() === id.toUpperCase(),
    );

    setData(items);
  }, [id, products]);

  return (
    <main className="w-full h-full space-y-5 lg:space-y-10">
      <div>
        <h1 className="text-3xl lg:text-5xl capitalize font-medium">
          {id + "s"}
        </h1>
        <div className="w-full text-end lg:text-lg">{data.length} products</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-items-center gap-5 lg:gap-12">
        {data.map((item) => (
          <ProductCard
            key={item._id.toString()}
            _id={item._id}
            name={item.name}
            images={item.images}
            price={item.price}
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
