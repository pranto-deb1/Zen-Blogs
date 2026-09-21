import { Navbar } from "@/_components/nav";
import { getMe } from "@/services/getMe";
import React from "react";
import ProfileNavBar from "./profileNav";

async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();
  return (
    <div>
      <Navbar user={user} />
      <ProfileNavBar />
      {children}
    </div>
  );
}

export default ProfileLayout;
