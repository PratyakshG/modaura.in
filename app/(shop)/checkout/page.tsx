"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import useAmountStore from "@/app/stores/useAmountStore";
import useCartStore from "@/app/stores/useCartStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useDeliveryStore from "@/app/stores/useDeliveryStore";

const addressSchema = z.object({
  name: z.string().min(1, {
    message: "name is required",
  }),
  phone_number: z
    .string()
    .min(10, {
      message: "phone number must be 10 digits",
    })
    .max(10, {
      message: "phone number must be 10 digits",
    }),
  pincode: z
    .string()
    .min(6, {
      message: "pincode must be of 6 digits",
    })
    .max(6, {
      message: "pincode must be of 6 digits",
    }),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  locality: z.string().optional(),
  landmark: z.string().optional(),
});

type AddressType = z.infer<typeof addressSchema>;

const CheckoutPage = () => {
  const session = useSession();
  const { cart } = useCartStore();
  const { subTotal, discount, totalAmount } = useAmountStore();
  const { pincode } = useDeliveryStore();
  const { deliveryCharge, paymentMethod } = useDeliveryStore();

  const form = useForm<AddressType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      pincode: `${pincode}`,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: AddressType) => {
    const cart = useCartStore.getState().cart;
    console.log(session.data?.user.id);

    const res = await fetch(`/api/order/${paymentMethod.toLowerCase()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.data?.user.id,
        createdAt: new Date(),
        items: cart,
        amount: totalAmount,
        address: data,
      }),
    });

    if (res.ok) {
      // router.push("/order/payment");
      console.log(res.json());
    }
  };

  return (
    <section className="w-full flex max-md:flex-col-reverse max-md:gap-10 items-start justify-between font-urbanist">
      {/* section to display all the details of the customer */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-md:w-full w-1/2"
        >
          <h1 className="font-semibold max-md:text-lg text-3xl">
            Address Details
          </h1>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Full Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between *:w-full gap-5">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="9876543210"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      defaultValue={pincode}
                      placeholder="234567"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area/Street</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Hazratganj"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between *:w-full gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/District/Town</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Lucknow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Uttar Pradesh"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locality</FormLabel>
                <FormControl>
                  <Input className="bg-white" placeholder="park" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Landmark</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="near xyz building"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end">
            <Button type="submit" className="bg-darkTeal font-urbanist">
              Proceed to Payment
            </Button>
          </div>
        </form>
      </Form>

      {/* section to show the cart summary */}
      <div className="flex flex-col max-md:w-full w-1/3 p-5 gap-5 max-md:rounded-lg rounded-2xl shadow-lg bg-white">
        {cart.map((item) => (
          <div
            key={item._id.toString()}
            className="flex items-start justify-between"
          >
            <div className="flex gap-3">
              <Image
                src={item.images[0]}
                alt={item.name}
                width={100}
                height={100}
                className="max-md:rounded-md rounded-lg max-md:size-20"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-sm">Quantity : {item.quantity}</span>
              </div>
            </div>
            <div className="font-medium text-sm lg:text-lg text-nowrap">
              Rs. {item.price.sellingPrice}
            </div>
          </div>
        ))}
        <div className="h-fit">
          <ul className="*:flex flex flex-col *:justify-between *:max-md:text-sm max-md:gap-2 gap-3 w-full">
            <li>
              <p>Price ({cart.length} items)</p>
              <p>₹ {subTotal}</p>
            </li>
            <li>
              <p>Discount</p>
              <p className="text-green-600">- ₹ {discount}</p>
            </li>
            <li>
              <p>Delivery ({paymentMethod})</p>
              <p>₹ {deliveryCharge}</p>
            </li>
          </ul>

          <div className="flex items-center justify-between font-semibold max-md:py-2 py-4 border-t border-b border-dotted border-neutral-500">
            <span>Total</span>
            <span className="">Rs. {totalAmount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
