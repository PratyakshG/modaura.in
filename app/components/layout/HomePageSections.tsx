"use client";

import useProductStore from "@/app/stores/useProductStore";
import Link from "next/link";
import ProductCard from "../product/ProductCard";

const HomePageSection = ({
  section,
  sectionId,
}: {
  section: string;
  sectionId: string;
}) => {
  const { products } = useProductStore();

  const items = products.filter(
    (product) => product.category.toUpperCase() === section.toUpperCase(),
  );

  return (
    <section
      id={sectionId}
      className="w-full space-y-5"
    >
      <div className="w-full flex flex-col space-y-3 lg:space-y-10 text-center">
        <h3 className="text-xl lg:text-5xl tracking-tighter">
          Shop For <span className="font-semibold">{section}s</span>
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:mt-6">
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

        <Link
          href={`/productByCategory/${section}`}
          className="cursor-pointer transition-all font-urbanist hover:-translate-y-0.5 border border-neutral-400 px-2 py-2 lg:px-4 lg:py-2 hover:border-black-1 w-fit place-self-center max-sm:text-sm"
        >
          View All {section}s
        </Link>
      </div>
    </section>
  );
};

export default HomePageSection;
