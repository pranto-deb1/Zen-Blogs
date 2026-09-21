import React, { Suspense } from "react";
import EditProfileForm from "./editProfileForm";
import { getMe } from "@/services/getMe";


async function ProfileFormFetcher() {
  const user = await getMe();

  const data = {
    name: user?.data?.name,
    email: user?.data?.email,
    bio: user?.data?.profile?.bio,
    profilePhoto: user?.data?.profile?.profilePhoto,
  };

  return <EditProfileForm data={data} />;
}


export default function EditProfileD() {
  return (
    <div>
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfileFormFetcher />
      </Suspense>
    </div>
  );
}