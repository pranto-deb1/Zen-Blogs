"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const Token = cookieStore.get("refreshToken")?.value || null;
  console.log(Token);

  if (!Token) {
    return {
      success: false,
      message: "refresh token not found",
    };
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${Token}`,
      },
      cache: "no-cache",
    },
  );

  return res.json();
};
