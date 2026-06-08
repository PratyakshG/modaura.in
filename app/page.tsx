import { homePageSections } from "@/constants/data";
import Hero from "./components/layout/Hero";
import HomePageSection from "./components/layout/HomePageSections";
import Latest from "./components/layout/Latest";
import Popular from "./components/layout/Popular";
import Image from "next/image";
import tarnishBanner from "../public/images/tarnish-banner.jpg";
import { Suspense } from "react";

const Home = () => {
  return (
    <>
      <Hero />
      <Popular />

      <section
        className="w-full grid space-y-3 lg:space-y-10"
        id="shop-by-category"
      >
        <h3 className="text-3xl lg:text-5xl text-center tracking-tighter">
          Shop By <span className="font-semibold">Category</span>
        </h3>

        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 *:aspect-square *:h-full *:w-full *:bg-red-300 *:rounded-md *:overflow-clip">
          <div>
            <Image
              src="/images/shop-for-rings.png"
              alt="shop-for-rings"
              height={500}
              width={500}
              className="hover:scale-120 origin-top-left transition-all"
            />
          </div>
          <div>
            <Image
              src="/images/shop-for-necklaces.png"
              alt="shop-for-necklaces"
              height={500}
              width={500}
              className="hover:scale-120 origin-left transition-all"
            />
          </div>
          <div>
            <Image
              src="/images/shop-for-earrings.png"
              alt="shop-for-earrings"
              height={500}
              width={500}
              className="hover:scale-120 origin-bottom-left transition-all"
            />
          </div>
          <div>
            <Image
              src="/images/shop-for-bracelets.png"
              alt="shop-for-bracelets"
              height={500}
              width={500}
              className="hover:scale-120 origin-top-left transition-all"
            />
          </div>
        </div>
      </section>

      <Latest />
      <Image
        src={tarnishBanner}
        alt=""
        width={1440}
        height={300}
        loading="lazy"
        className="w-full rounded-md lg:rounded-xl shadow-md"
      />

      <Suspense fallback={<div>loading products...</div>}>
        {homePageSections.map((item, index) => (
          <HomePageSection
            key={index}
            section={item.section}
            sectionId={item.sectionId}
          />
        ))}
      </Suspense>
    </>
  );
};

export default Home;
