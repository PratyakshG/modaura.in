"use server";

import { signIn, signOut } from "@/auth";

export const login = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({
    redirect: true,
    redirectTo: "/login",
  });

  console.log("user logged out");
};
