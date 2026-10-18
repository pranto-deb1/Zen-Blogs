"use client";
import { Button } from "@/_components/ui/button";
import { Card } from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { IRegisterState, registerAction } from "../_actions/formActions";

const initialRegisterState: IRegisterState = {
  success: false,
  status: 0,
  message: "",
};

function RegisterForm() {
  const [state, action, pending] = useActionState(
    registerAction,
    initialRegisterState,
  );
  const [isPassword, setIsPassword] = useState(true);

  useEffect(() => {
    if (state && state.status === 0) return;
    if (!state.success) {
      toast.error(state.message || "Register failed");
    }

    toast.success(state.message || "successfully created user")

  });

  // useEffect(() => {
  //   if (!state) return;

  //   if (!state.success) {
  //     toast.error(state.message || "Register failed");
  //   }
  // }, [state]);

  return (
    <form action={action} className="mt-10">
      <Card className="p-5">
        <div className="flex gap-3">
          <Input
            name="firstName"
            type="text"
            placeholder="First Name"
            required
          />
          <Input name="lastName" type="text" placeholder="Last Name" required />
        </div>

        <Input name="email" type="email" placeholder="Enter your email" />
        <div className="relative">
          <Input
            name="password"
            type={`${isPassword ? "password" : "text"}`}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="absolute top-[50%] translate-y-[-50%] right-4"
            onClick={() => setIsPassword(!isPassword)}
          >
            {isPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <div className="relative">
          <Input
            name="conformPassword"
            type={`${isPassword ? "password" : "text"}`}
            placeholder="Conform password"
            required
          />
          <button
            type="button"
            className="absolute top-[50%] translate-y-[-50%] right-4"
            onClick={() => setIsPassword(!isPassword)}
          >
            {isPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <Button type="submit">{pending ? "pending..." : "Register"}</Button>
      </Card>

      <div className="flex justify-between mt-5 px-3">
        <p className="">Already have an account?</p>{" "}
        <Link href={"/login"} className="hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;
