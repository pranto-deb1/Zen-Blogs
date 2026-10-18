"use server";

import { jwtUtils } from "@/_components/utils/jtw";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface ICheckoutResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    paymentUrl: string;
  };
}

export const subscribePremium = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login", "replace");
  }

  const verifiedToken = jwtUtils.VerifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET as string,
  );

  if (!verifiedToken.success) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/subscription/checkout`,
    {
      method: "POST",

      headers: { Cookie: `accessToken=${accessToken}` },
    },
  );

  const response: ICheckoutResponse = await res.json();

  if (!response.success) {
    return {
      success: false,
      message: response.message,
    };
  }

  console.log(response.data?.paymentUrl);

   redirect(response.data?.paymentUrl as string, "replace");
};
