import useAmountStore from "@/app/stores/useAmountStore";
import useCartStore from "@/app/stores/useCartStore";
import useDeliveryStore from "@/app/stores/useDeliveryStore";
import { useEffect } from "react";

const CartSubTotalSection = ({
  setLoading,
}: {
  setLoading: (value: boolean) => void;
}) => {
  const { cart } = useCartStore();

  const { deliveryCharge, paymentMethod } = useDeliveryStore();

  const {
    subTotal,
    discount,
    totalAmount,
    promoCode,
    promoDiscount,
    additionalDiscount,
    setSubTotal,
    setDiscount,
    setTotalAmount,
    setPromoCode,
    setPromoDiscount,
    setAdditionalDiscount,
  } = useAmountStore();

  //cart actions
  useEffect(() => {
    if (cart.length > 0) {
      const cartSubTotal = cart.reduce(
        (acc, product) => acc + product.price.mrp * product.quantity,
        0
      );
      setSubTotal(cartSubTotal);
    }

    const discount =
      subTotal -
      cart.reduce(
        (acc, product) => acc + product.price.sellingPrice * product.quantity,
        0
      );
    setDiscount(discount);

    const cartTotal = subTotal - discount;

    //cartTotal exceeds 1499/-
    if (cartTotal > 1499) {
      const disc = cartTotal * 0.1;
      setAdditionalDiscount(Math.round(disc));
    } else {
      setAdditionalDiscount(0);
    }

    //cartTotal exceeds 999/-
    if (promoCode === "THANKS10") {
      setPromoDiscount(Math.round((cartTotal - additionalDiscount) * 0.1));
    } else {
      setPromoDiscount(0);
    }

    const finalAmount =
      cartTotal - promoDiscount - additionalDiscount + deliveryCharge;
    setTotalAmount(Math.round(finalAmount));
  }, [
    cart,
    subTotal,
    deliveryCharge,
    promoCode,
    promoDiscount,
    additionalDiscount,
    setSubTotal,
    setPromoCode,
    setDiscount,
    setTotalAmount,
    setPromoDiscount,
    setAdditionalDiscount,
  ]);

  return (
    <>
      <div className="w-full">
        <ul className="*:flex flex flex-col *:justify-between gap-3 w-full">
          <li>
            <p>Subtotal</p>
            <p>Rs. {subTotal}</p>
          </li>

          <li>
            <p>Discount</p>
            <p className="text-green-600 font-medium">- Rs. {discount}</p>
          </li>

          {additionalDiscount > 0 && (
            <li>
              <p>Additional Discount</p>
              <p className="text-green-600 font-medium">
                - Rs. {additionalDiscount}
              </p>
            </li>
          )}

          {promoCode === "THANKS10" && promoDiscount > 0 && (
            <li>
              <p>Promo Discount</p>
              <p className="text-green-600 font-medium">
                - Rs. {promoDiscount}
              </p>
            </li>
          )}

          <li>
            <p>Delivery</p>
            {paymentMethod === "COD" ? (
              <span className="">Rs. {deliveryCharge}</span>
            ) : (
              <p className="text-green-600 font-semibold">Free</p>
            )}
          </li>
        </ul>

        <div className="flex items-center justify-between font-semibold py-4 border-t border-b border-dotted border-neutral-500">
          <span>Total</span>
          <span>Rs. {totalAmount}</span>
        </div>

        <div className="flex flex-col gap-2 pt-5">
          <span className="text-sm">Do you have a promo code?</span>
          <div className="flex bg-gray-200 rounded-full">
            <input
              type="text"
              name="apply promo code"
              className="py-2 w-full rounded-full pl-5 placeholder:text-sm focus:outline-none"
              onChange={(e) => {
                e.preventDefault();
                setLoading(true);
                setTimeout(() => {
                  setPromoCode(e.target.value);
                  setLoading(false);
                }, 500);
              }}
              defaultValue={promoCode ?? promoCode}
              placeholder="Enter promo code"
            />
          </div>

          {promoCode === "THANKS10" && promoDiscount > 0 && (
            <p className="text-green-600 font-semibold text-sm">
              Extra 10% discount applied{" "}
              <span className="text-black-1 font-normal">
                (excluding delivery charges)
              </span>
            </p>
          )}

          {promoCode.length > 0 && promoDiscount <= 0 && (
            <p className="text-red-600 font-semibold text-sm capitalize">
              Invalid coupon code or coupon inapplicable
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSubTotalSection;
