"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
import Image from "next/image";

import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useLayoutEffect, useState } from "react";
import { homeScreenCarousel } from "@/constants/data";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);

  // useEffect(() => {
  //   const handleResize = () => setWidth(window.innerWidth);
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useLayoutEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
            }),
            WheelGesturesPlugin(),
          ]}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full aspect-square lg:aspect-[2/1] max-h-[80vh] rounded-lg lg:rounded-4xl overflow-hidden"
        >
          {/* desktop carousel */}
          <CarouselContent className="w-full h-full -ml-0 *:flex *:items-center *:justify-center z-10">
            {width && (
              <>
                {homeScreenCarousel.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full h-full pl-0"
                  >
                    <Image
                      src={width < 768 ? item.mobile : item.desktop}
                      alt="img1"
                      width={1600}
                      height={900}
                      className="h-auto w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </>
            )}
          </CarouselContent>
        </Carousel>

        <div className="flex gap-2 py-3 lg:pt-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`border border-black h-2 rounded-full transition-all duration-300 ${
                current === index ? "bg-black w-10" : "w-2"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
