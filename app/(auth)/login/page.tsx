"use client";
import { login } from "@/lib/actions";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="w-full place-items-center p-10 text-center">
      <div className="lg:w-[50vw] border flex flex-col items-center justify-around rounded-3xl gap-10 p-10 shadow-xl">
        <div className="flex flex-col">
          <span className="font-medium text-3xl">
            Welcome To
          </span>
          <span className="font-semibold text-4xl">Modaura</span>
        </div>

        <button
          onClick={() => login()}
          className="flex items-center justify-center border border-darkTeal px-5 py-3 gap-3 rounded-xl hover:shadow-lg hover:-translate-y-1 transition"
        >
          <FcGoogle className="size-5" /> Login With Google
        </button>
      </div>
    </div>
  );
};

export default Login;
