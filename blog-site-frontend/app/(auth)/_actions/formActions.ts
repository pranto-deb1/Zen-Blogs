"use server";

import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redirect } from "next/navigation";

interface LoginState {
  success: boolean;
  status: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const loginAction = async (
  previousData: LoginState,
  formData: FormData,
) => {
  // console.log("Previous State", previousData);
  const email = formData.get("email");
  const password = formData.get("password");

  const payload = {
    email,
    password,
  };

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  const resultData = result as LoginState;
  const cookieStore = await cookies();

  if (resultData.success) {
    cookieStore.set("accessToken", resultData.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", resultData.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const decodedToken = jwt.decode(resultData.data.accessToken) as JwtPayload;
    if (decodedToken.role === "ADMIN") {
      redirect("/admin-dashboard", "replace");
    } else if (decodedToken.role === "AUTHOR") {
      redirect("/author-dashboard", "replace");
    } else if (decodedToken.role === "USER") {
      redirect("/dashboard", "replace");
    }

  }

  return result;
};
