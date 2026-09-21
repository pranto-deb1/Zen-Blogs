import { Navbar } from "@/_components/nav";
import { getMe } from "@/services/getMe";
import React from "react";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();

  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  );
}

export default AuthLayout;
