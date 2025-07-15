"use client";

import { logout } from "@/lib/actions";
// import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
// import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
  //   const [isEditing, setIsEditing] = useState();

  const submitHandler = () => {};

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-semibold">Personal Information</h1>

      <form
        onSubmit={submitHandler}
        className="bg-neutral-200 w-1/3 flex flex-col gap-5 rounded-2xl p-10 shadow-lg"
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

      <button
        onClick={() => logout()}
        className="text-shadow text-red-500 font-medium"
      >
        Sign Out
      </button>

      <button className="text-shadow text-red-500 font-medium">
        Delete Account
      </button>
    </div>
  );
};

export default ProfilePage;
