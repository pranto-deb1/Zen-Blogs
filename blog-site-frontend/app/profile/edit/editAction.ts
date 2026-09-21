"use server";

interface IUpdateData {
  name?: string;
  email?: string;
  profilePhoto?: string;
  bio?: string;
}

export const editFormAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const profilePhoto = formData.get("profilePhoto") as string;
  const bio = formData.get("bio") as string;

  const updateData: IUpdateData = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (profilePhoto) updateData.profilePhoto = profilePhoto;
  if (bio) updateData.bio = bio;
};
