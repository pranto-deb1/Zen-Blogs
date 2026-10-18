"use client";
import { Button } from "@/_components/ui/button";
import { Card } from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { loginAction } from "../_actions/formActions";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, false);
  const [isPassword, setIsPassword] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      setIsLoggedIn(true);
    }
    if (!state.success) {
      toast.error(state.message || "login failed");
    }
  }, [state]);

  useEffect(() => {
    if (isLoggedIn) {
      toast.success(state.message || "successfully logged in");
    }
  }, [isLoggedIn]);

  return (
    <form action={action} className="mt-10">
      <Card className="p-5">
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
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
        <Button type="submit">{pending ? "pending..." : "Login"}</Button>
      </Card>

      <div className="flex justify-between mt-5 px-3">
        <p className="">Already have an account?</p>{" "}
        <Link href={"/register"} className="hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
