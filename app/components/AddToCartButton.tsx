import useCartStore from "@/app/stores/useCartStore";
import { productTypes } from "@/types/index";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiCart } from "react-icons/bi";
import { toast } from "sonner";


const AddToCartButton = ({ _id, name }: productTypes) => {
  const { addToCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const session = useSession();

  const handleAddToCart = async () => {
    if (session?.data?.user) {
      const cart = useCartStore.getState().cart;

      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cart }),
      });
      console.log(cart);
    }
  };

  return (
    <>
      <button
        onClick={async () => {
          setLoading(true);
          await addToCart(_id);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          handleAddToCart();
          toast(`${name} is added to cart.`);
          setLoading(false);
        }}
        className="w-full flex items-center justify-center gap-2 bg-darkTeal text-ivory text-sm md:text-base rounded-md lg:rounded-xl py-2.5 md:py-3 lg:px-4 hover:opacity-90 transition-all duration-200 ease-in-out cursor-pointer"
      >
        {!loading ? (
          <>
            <BiCart size={16} /> Add To Cart
          </>
        ) : (
          <>
            <Loader className="animate-spin" />
          </>
        )}
      </button>
    </>
  );
};

export default AddToCartButton;
