import { ICreateUser } from "../../interfaces/auth.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

const insertUser = async (payload: ICreateUser) => {

  const { name, email, password } = payload;

  // check if all data is there properly
  if (!name || !email || !password) {
    throw CreateErrorRes("Please Enter name, email, password", 401)
  }

  // check if user already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  })


  if (isUserExists) {
    throw CreateErrorRes("User Already Exists", 409);
  }

  // creating user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    }
  });

  return user
};



export const AuthService = {
  insertUser
}

