import useCartStore from "@/app/stores/useCartStore";
import { Loader } from "lucide-react";
import { ObjectId } from "mongoose";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiCart } from "react-icons/bi";
import { toast } from "sonner";

interface AddToCartBtnTypes {
  _id: ObjectId;
  name: string;
}

const AddToCartButton = ({ _id, name }: AddToCartBtnTypes) => {
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
        className="w-full flex items-center justify-center gap-2 border border-darkTeal text-xs lg:text-sm hover:bg-darkTeal hover:text-ivory py-2.5 md:py-3 lg:px-4 duration-200 ease-in-out cursor-pointer transition-all uppercase rounded-md"
      >
        {!loading ? (
          <>
            Add To Cart <BiCart size={16} />
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
