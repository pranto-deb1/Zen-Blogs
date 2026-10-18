"use server";

import { cookies } from "next/headers";

export const getPremiumNews = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken");

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/premium`, {
    method: "GET",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
  });

  const result = await res.json();

  return result;
};
