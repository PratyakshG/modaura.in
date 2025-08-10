import useAmountStore from "@/app/stores/useAmountStore";
import useCartStore from "@/app/stores/useCartStore";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PaymentSuccess = () => {
  const { paymentSuccess, setPaymentSuccess } = useAmountStore();
  const { cart, setCart } = useCartStore();
  const { totalAmount } = useAmountStore();
  const session = useSession();
  const router = useRouter();

  const updateCart = async () => {
    if (session.data?.user) {
      setCart([]);
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
      <Drawer
        open={paymentSuccess}
        modal={true}
        onClose={async () => {
          updateCart();
          setPaymentSuccess(false);
          router.push("/");
        }}
      >
        <DrawerContent className="py-10 flex flex-col items-center justify-between">
          <DrawerHeader className="place-items-center">
            <DrawerTitle className="text-3xl">Congratulations!!</DrawerTitle>
            <DrawerTitle>Your Order has been placed!!!</DrawerTitle>
            <DrawerDescription>Amount : Rs. {totalAmount}</DrawerDescription>
            {/* <DrawerDescription>Payment Mode : {payment}</DrawerDescription> */}
          </DrawerHeader>

          <DrawerHeader className="place-items-center">
            <DrawerTitle>Products</DrawerTitle>
            {cart.map((item) => (
              <DrawerDescription key={item._id.toString()}>
                {item.name} x {item.quantity}
              </DrawerDescription>
            ))}
          </DrawerHeader>
          <DrawerFooter className="place-items-center">
            <DrawerTitle>
              Estimated Delivery Time : 3-7 business days.
            </DrawerTitle>
            <DrawerDescription>
              You will recieve a confirmation mail shortly with all details.
            </DrawerDescription>
            <DrawerClose
              onClick={() => {
                updateCart();
                setPaymentSuccess(false);
              }}
              className="bg-darkTeal w-fit px-6 py-3 rounded-md text-ivory"
            >
              <Link href="/" referrerPolicy="no-referrer">
                Continue Shopping
              </Link>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PaymentSuccess;
