"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";

import img1 from "@/public/images/M-1.jpg";
import img2 from "@/public/images/M-2.jpg";
import img3 from "@/public/images/M-3.jpg";
import img4 from "@/public/images/M-4.jpg";
import img5 from "@/public/images/M-5.jpg";

import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useState } from "react";

const Hero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
          className="w-full aspect-square lg:aspect-[2/1] max-h-[80vh] bg-neutral-300 rounded-lg lg:rounded-4xl overflow-hidden"
        >
          <CarouselContent className="w-full h-full -ml-0 *:flex *:items-center *:justify-center">
            <CarouselItem className="basis-full h-full pl-0">
              <Image
                src={img1}
                alt="img1"
                className="h-auto w-full object-cover"
              />
            </CarouselItem>
            <CarouselItem className="basis-full pl-0 relative">
              <Image
                src={img2}
                alt="img1"
                className="h-auto w-full object-top object-cover"
              />
            </CarouselItem>
            <CarouselItem className="basis-full pl-0">
              <Image src={img3} alt="img1" className="object-cover" />
            </CarouselItem>
            <CarouselItem className="basis-full pl-0">
              <Image src={img4} alt="img1" className="object-cover" />
            </CarouselItem>
            <CarouselItem className="basis-full pl-0">
              <Image src={img5} alt="img1" className="object-cover" />
            </CarouselItem>
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
