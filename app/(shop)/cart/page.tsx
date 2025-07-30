"use client";

import useCartStore from "@/app/stores/useCartStore";
import useDeliveryStore from "@/app/stores/useDeliveryStore";
import CartSubTotalSection from "@/components/layout/CartSubTotalSection";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsHandbag } from "react-icons/bs";
import { LuMinus, LuPlus } from "react-icons/lu";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const {
    pincode,
    paymentMethod,
    setPincode,
    setDeliveryCharge,
    setPaymentMethod,
  } = useDeliveryStore();

  const [loading, setLoading] = useState<boolean>(false);
  // const [promoCode, setPromoCode] = useState<string>("");
  const [deliveryPossible, setDeliveryPossible] = useState<boolean>(false);
  const session = useSession();

  const handleUpdateCart = async () => {
    setLoading(true);
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
    // console.log(cart);
    setLoading(false);
  };

  //function to calculate shipping cost to a pincode
  useEffect(() => {
    setLoading(true);
    // const handleDelivery = async () => {
    //   const shippingCostResponse = await fetch(
    //     `/api/delhivery/shipping-cost/?pincode=${pincode}&paymentMode=${paymentMethod}`
    //   );

    //   const shippingCostData = await shippingCostResponse.json();
    //   setDeliveryCharge(Math.ceil(shippingCostData[0]?.total_amount));
    // };

    // handleDelivery();

    if (paymentMethod === "COD") setDeliveryCharge(50);
    if (paymentMethod === "Pre-paid") setDeliveryCharge(0);
    setLoading(false);
  }, [paymentMethod, setDeliveryCharge, pincode]);

  // function to find serviceable pincode and their shipping costs
  useEffect(() => {
    const findPincode = async () => {
      setLoading(true);
      //api to fetch if delivery is possible at a pincode
      const pincodeServiceable = await fetch(
        `/api/delhivery/pincode-check/?pincode=${pincode}`
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const deliveryAvailable: any = await pincodeServiceable.json();
      if (deliveryAvailable.delivery_codes.length == 0) {
        setDeliveryPossible(false);
        return;
      }

      setDeliveryPossible(true);
    };

    if (pincode.length === 6) {
      findPincode();
    } else {
      setDeliveryPossible(false);
    }
    setLoading(false);
  }, [pincode]);

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
        <div className="w-full h-full lg:max-h-[82dvh] overflow-scroll max-md:flex-col flex justify-between gap-5 font-dmSans relative">
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
                          Rs. {product?.price?.mrp}
                        </span>
                        <span className="font-semibold lg:text-xl">
                          Rs. {product?.price?.sellingPrice}
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
                          setTimeout(resolve, 500)
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
                      await new Promise((resolve) => setTimeout(resolve, 500));
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
          <div className="lg:w-1/3 sticky top-0 bg-white h-fit mb-5 p-5 rounded-2xl shadow-lg">
            <CartSubTotalSection setLoading={setLoading} />

            <div className="pt-4">
              <span className="text-sm">
                Enter pincode to check delivery options
              </span>
              <div className="flex gap-5">
                <Input
                  className="bg-white"
                  placeholder="enter pincode"
                  defaultValue={pincode}
                  onChange={(e) => {
                    setLoading(true);
                    setTimeout(() => {
                      setPincode(e.target.value);
                      setLoading(false);
                    }, 500);
                  }}
                />
              </div>
            </div>

            {pincode.length > 0 && pincode.length !== 6 && (
              <span className="text-red-500 text-sm">
                Error : please enter 6 digit pincode
              </span>
            )}

            {pincode.length === 6 && (
              <>
                {deliveryPossible ? (
                  <div className="text-green-600 font-semibold text-sm">
                    Delivery in 3-7 business days
                  </div>
                ) : (
                  <div className="text-red-400 font-semibold text-sm">
                    delivery not possible
                  </div>
                )}
              </>
            )}

            {pincode.length === 6 && deliveryPossible && (
              <div className="pt-4 flex flex-col gap-2">
                <span className="text-sm">Choose Payment Method</span>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2 bg-neutral-100 p-2 rounded-md">
                    <input
                      type="radio"
                      id="COD"
                      value="COD"
                      name="payment-method"
                      defaultChecked={paymentMethod === "COD" && true}
                      onChange={(e) => {
                        setLoading(true);
                        setTimeout(() => {
                          setPaymentMethod(e.target.value);
                          setLoading(false);
                        }, 500);
                      }}
                    />
                    <label htmlFor="COD">Cash On Delivery</label>
                  </div>

                  <div className="flex items-center space-x-2 bg-neutral-100 p-2 rounded-md">
                    <input
                      type="radio"
                      id="Pre-paid"
                      value="Pre-paid"
                      name="payment-method"
                      defaultChecked={paymentMethod === "Pre-paid" && true}
                      onChange={(e) => {
                        setLoading(true);
                        setTimeout(() => {
                          setPaymentMethod(e.target.value);
                          setLoading(false);
                        }, 500);
                      }}
                    />
                    <label htmlFor="Pre-paid">
                      Pre-paid (UPI / Net Banking / Card)
                    </label>
                  </div>
                </div>

                <span className="text-red-500 text-sm font-medium">
                  Note: COD might incur additional delivery charges
                </span>
              </div>
            )}

            {session.status === "authenticated" ? (
              <div className="w-full flex items-end justify-end pt-5">
                {pincode.length !== 6 ? (
                  <span className="text-red-500">
                    Enter Pincode To Proceed To Checkout
                  </span>
                ) : (
                  <>
                    {loading ? (
                      <button className="bg-darkTeal px-5 py-2 text-ivory rounded-full flex items-center justify-center gap-2">
                        <span>Loading</span>
                        <Loader className="animate-spin size-5" />
                      </button>
                    ) : (
                      <Link
                        href="/checkout"
                        className="bg-darkTeal px-5 py-2 text-ivory rounded-full"
                      >
                        Proceed to Checkout
                      </Link>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="w-full flex items-end justify-end">
                  <Link
                    href="/login"
                    className="bg-neutral-400 hover:bg-darkTeal px-5 py-2 text-ivory rounded-full transition"
                  >
                    Login to Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
