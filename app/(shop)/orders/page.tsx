"use client";

import { orderTypes } from "@/types/index";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsHandbag } from "react-icons/bs";

const Page = () => {
  const [orders, setOrders] = useState<orderTypes[]>([]);

  useEffect(() => {
    async function getOrders() {
      const res = await fetch(`/api/order/userOrders`);
      const data = await res.json();

      setOrders(data);
    }

    getOrders();
  }, []);

  return (
    <section
      id="orders"
      className="w-full lg:px-10 rounded-xl lg:rounded-4xl"
    >
      {orders.length === 0 ? (
        <div className="text-center w-full h-full flex flex-col items-center justify-center gap-5 my-5 py-10 shadow-lg border border-neutral-200">
          <div className="flex flex-col items-center justify-center gap-5">
            <BsHandbag className="size-30 fill-darkTeal" />
            <article className="flex flex-col">
              <span className="text-2xl font-semibold">
                You have no order history!!!
              </span>
            </article>
          </div>

          <Link
            href="/"
            className="bg-darkTeal opacity-85 hover:opacity-100 w-[200px] h-[40px] rounded text-ivory place-content-center shadow transition-all`"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="w-full space-y-3 lg:space-y-5">
          <h1 className="text-3xl lg:text-4xl font-medium">Order History</h1>

          <ul className="flex flex-col gap-5">
            {orders.map((order) => (
              <div
                key={order._id.toString()}
                className="rounded-md lg:rounded-xl flex flex-col items-start justify-between border border-neutral-300"
              >
                <div className="bg-neutral-200 px-3 py-2 lg:px-10 w-full flex flex-wrap items-center justify-between *:text-xs rounded-t-md lg:rounded-t-xl max-md:space-x-5 max-md:space-y-2">
                  <li>
                    PAYMENT MODE
                    <br />
                    <span className="font-medium text-sm">
                      {order.paymentMode}
                    </span>
                  </li>
                  <li>
                    TOTAL
                    <br />
                    <span className="font-medium text-sm">
                      Rs. {order.amount}.00
                    </span>
                  </li>
                  <li>
                    ORDER PLACED
                    <br />
                    <span className="font-medium text-sm">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                  <li>
                    ORDER ID
                    <br />
                    <span className="font-medium text-sm">
                      {order._id.toString()}
                    </span>
                  </li>
                </div>

                <div className="flex flex-col gap-2 w-full p-3 lg:px-10 lg:py-5">
                  {order.items.map((item) => (
                    <div key={item._id.toString()} className="flex gap-2">
                      <div className="rounded max-sm:size-12 size-24 aspect-square object-cover place-items-center overflow-hidden">
                        <Image
                          src={item.images[0]}
                          alt="item-image"
                          height={50}
                          width={50}
                          className="object-cover size-full scale-125"
                        />
                      </div>
                      <div className="max-sm:space-y-1">
                        <li className="text-xl max-sm:leading-4 hover:underline text-darkTeal">
                          <Link href={`/product/${item._id}`}>{item.name}</Link>
                        </li>

                        <li className="text-xs md:text-sm max-sm:leading-2.5 text-neutral-500">
                          Category: {item.category}
                        </li>

                        <li className="text-xs md:text-sm max-sm:leading-2.5 text-neutral-500">
                          Quantity: {item.quantity}
                        </li>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Page;
