"use server";

import { cookies } from "next/headers";


export const refreshToken = async () => {
  const cookieStore = cookies();

  const Token = (await cookieStore).get("refreshToken")?.value;

  if (!Token) {
    return {
      success: false,
      message: "user is not logged in",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: `${refreshToken}`,
    },

    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  });

  return res.json();
};
