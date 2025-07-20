"use client";

import { logout } from "@/lib/actions";
// import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  //   const [isEditing, setIsEditing] = useState();

  const submitHandler = () => {};

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <h1 className="text-3xl lg:text-4xl font-semibold">
        Personal Information
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-neutral-200 w-full lg:w-1/3 flex flex-col gap-5 rounded-2xl p-5 lg:p-10 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="py-3 flex flex-col rounded-lg">
            <span>Hello,</span>
            <span className="font-medium text-2xl">{session?.user.name}</span>
          </div>
          <Image
            src={
              session?.user.image ? session?.user.image : "/public/globe.svg"
            }
            alt="user-image"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col">
          <span className="pl-2">Email</span>
          <span className="px-5 py-3 bg-white rounded-lg">
            {session?.user.email}
          </span>
        </div>

        {/* <div className="flex flex-col">
          <span className="pl-2">Phone Number</span>
          <span className="px-5 py-3 bg-white rounded-lg">
            {session?.user.email}
          </span>
        </div> */}
      </form>

      <div className="w-full flex items-center justify-center gap-2 *:rounded-md">
        <button
          onClick={async () => {
            await logout().then(() => router.push("/"));
          }}
          className="text-shadow font-medium border max-sm:w-full py-2 px-5 bg-red-400 text-white hover:bg-red-500 transition"
        >
          Sign Out
        </button>

        {/* <button className="w-full text-shadow text-red-500 font-medium py-2 bg-white">
          Delete Account
        </button> */}
      </div>
    </div>
  );
};

export default ProfilePage;
