import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });

  if (!user) {
    throw CreateErrorRes("User not found", 404);
  }

  return user;
};

export const UsersService = {
  getUser,
};
