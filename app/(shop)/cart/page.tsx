"use client";

import useCartStore from "@/app/stores/useCartStore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsHandbag } from "react-icons/bs";
import { LuMinus, LuPlus } from "react-icons/lu";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const [promoCode, setPromoCode] = useState<string>("");
  const session = useSession();

  const subTotal =
    cart.length > 0
      ? cart.reduce(
          (acc, product) => acc + product.price.mrp * product.quantity,
          0
        )
      : 0;

  const discount =
    subTotal -
    cart.reduce(
      (acc, product) => acc + product.price.sellingPrice * product.quantity,
      0
    );

  const handleUpdateCart = async () => {
    if (session.data?.user) {
      //retrieve the latest cart state to remove the delay in updation to the API
      const cart = useCartStore.getState().cart;

      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cart }),
      });
    }
    console.log(cart);
  };

  return (
    <>
      {/* capture cart state from zustand and render conditionally */}
      {cart.length === 0 ? (
        <div className="text-center w-full h-full flex flex-col items-center justify-center gap-5 my-5 py-10 shadow-lg border border-neutral-200">
          <div className="flex flex-col items-center justify-center gap-5">
            <BsHandbag className="size-30 fill-darkTeal" />
            <article className="flex flex-col">
              <span className="text-2xl font-semibold">
                Your cart is empty!!!
              </span>
              <span className="font-light text-sm">
                Add items to your cart now.
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
        <div className="w-full h-full lg:max-h-[82dvh] overflow-scroll max-md:flex-col flex justify-between gap-5 font-urbanist relative">
          {/* item subtotal section */}
          <div className="lg:w-2/3 h-full bg-[#ececec] rounded-xl lg:rounded-4xl flex flex-col gap-2 lg:gap-5 p-3 lg:p-10">
            <span className="text-xl lg:text-3xl font-medium">
              Cart Summary
            </span>

            {/* Image section to display product and quantity */}

            {cart.map((product) => (
              <div
                key={product?._id?.toString()}
                className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col w-full h-full p-2 lg:p-5 gap-2 lg:gap-5 shadow-lg"
              >
                <div className="flex w-full h-full">
                  <Image
                    src={product.images && product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="size-[100px] rounded-lg object-contain"
                  />

                  {/* Details of the product */}
                  <div className="w-full flex flex-col items-start justify-between max-sm:p-2 lg:px-10">
                    <div className="w-full flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium max-sm:text-sm">
                          {product.name}
                        </span>
                        <span className="font-light text-xs lg:text-sm line-through">
                          ₹ {product?.price?.mrp}
                        </span>
                        <span className="font-semibold lg:text-xl">
                          ₹ {product?.price?.sellingPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* actions for the product */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between gap-1 lg:gap-2 max-sm:text-xs">
                    <button
                      onClick={async () => {
                        if (product.quantity > 1) {
                          updateQuantity(product._id, product.quantity - 1);
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          handleUpdateCart();
                          toast(`${product.name} quantity is reduced`);
                        }
                      }}
                      className="p-1 lg:p-2 rounded-full border cursor-pointer hover:border-neutral-500"
                    >
                      <LuMinus />
                    </button>
                    <div className="py-0.5 px-4 lg:py-1 lg:px-5 rounded-full border">
                      {product.quantity}
                    </div>
                    <button
                      onClick={async () => {
                        updateQuantity(product._id, product.quantity + 1);
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        handleUpdateCart();
                        toast(`${product.name} quantity is increased`);
                      }}
                      className="p-1 lg:p-2 rounded-full border cursor-pointer hover:border-neutral-500"
                    >
                      <LuPlus />
                    </button>
                  </div>
                  <div
                    className="cursor-pointer font-medium opacity-60 hover:opacity-100 transition max-sm:text-xs"
                    onClick={async () => {
                      removeFromCart(product._id);
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      handleUpdateCart();
                    }}
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal Section */}
          <div className="lg:w-1/3 sticky top-0 bg-white h-fit p-5 rounded-2xl shadow-lg">
            <ul className="*:flex flex flex-col *:justify-between gap-3 w-full">
              <li>
                <p>Subtotal</p>
                <p>₹ {subTotal}</p>
              </li>
              <li>
                <p>Discount</p>
                <p>- ₹ {discount}</p>
              </li>
              <li>
                <p>Delivery</p>
                <p>₹ 999</p>
              </li>
              <li>
                <p>Taxes</p>
                <p>₹ 999</p>
              </li>
            </ul>

            <div className="flex items-center justify-between font-semibold py-4 border-t border-b border-dotted border-neutral-500">
              <span>Total</span>
              <span>Rs. {subTotal - discount}</span>
            </div>

            <div className="flex flex-col gap-2 pt-5">
              <span className="text-sm">Do you have a promotional code?</span>
              <div className="flex bg-gray-200 rounded-full">
                <input
                  type="text"
                  name="apply promo code"
                  className="py-2 w-full rounded-full pl-5 placeholder:text-sm focus:outline-none"
                  onChange={(e) => {
                    e.preventDefault();
                    setPromoCode(e.target.value);
                  }}
                  placeholder="Enter promo code"
                />
                <button
                  type="submit"
                  className="px-5 text-nowrap bg-darkTeal rounded-full text-white"
                >
                  apply code
                </button>
              </div>

              {promoCode}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
