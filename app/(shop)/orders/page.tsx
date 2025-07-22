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

  useEffect(() => {
    console.log("Orders updated", orders);
  }, [orders]);

  return (
    <section id="orders" className="w-full">
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
        <div className="w-full space-y-5">
          <h1 className="text-3xl lg:text-4xl font-medium">Order History</h1>

          <ul className="flex flex-col gap-5">
            {orders.map((order) => (
              <div
                key={order._id.toString()}
                className="bg-white px-5 py-8 rounded-xl shadow-md flex items-start justify-between"
              >
                <div className="flex flex-col gap-2">
                  {order.items.map((item) => (
                    <div key={item._id.toString()} className="flex gap-2">
                      <Image
                        src={item.images[0]}
                        alt="item-image"
                        height={50}
                        width={50}
                        className="rounded"
                      />
                      <div>
                        <li className="font-semibold md:text-lg max-sm:leading-4">{item.name}</li>
                        <li>quantity : {item.quantity}</li>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right text-sm md:text-base">
                  <li>Amount : {order.amount}</li>
                  <li>Payment Mode : {order.paymentMode}</li>
                  <li>
                    Order Date :{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </li>
                  <li>Order ID : {order._id.toString()}</li>
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
