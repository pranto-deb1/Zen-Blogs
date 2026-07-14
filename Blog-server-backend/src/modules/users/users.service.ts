import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

// get my user profile
const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });

  // check if the user exists
  if (!user) {
    throw CreateErrorRes("User not found", 404);
  }

  // return user
  return user;
};



export const UsersService = {
  getUser,
};
