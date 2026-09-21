"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = cookies();

  const accessToken = (await cookieStore).get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "user is not logged in",
    };
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: `${accessToken}`,
    },

    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  });

  return res.json();
};
