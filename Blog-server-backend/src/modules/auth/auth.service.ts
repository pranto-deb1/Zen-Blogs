import { config } from "../../config";
import { ICreateUser, ILoginUser } from "../../interfaces/auth.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";
import bcrypt from "bcrypt";

// create user
const insertUser = async (payload: ICreateUser) => {
  const { name, email, password } = payload;

  // check if all data is there properly
  if (!name || !email || !password) {
    throw CreateErrorRes("Please Enter name, email, password", 401);
  }

  // check if user already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExists) {
    throw CreateErrorRes("User Already Exists", 409);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // creating user and profile
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: "This is your profile boi. you can change it any moment",
          profilePhoto:
            "https://img.magnific.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2191.jpg?semt=ais_hybrid&w=740&q=80",
        },
      },
    },
  });

  // joining user and profile
  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

// create profile and login user
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // check if user exists
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findUser) {
    throw CreateErrorRes("User not found", 404);
  }

  const comparedPassword = await bcrypt.compare(password, findUser.password);

  // check user password
  if (!comparedPassword) {
    throw CreateErrorRes("Invalid Password", 403);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: findUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

export const AuthService = {
  insertUser,
  loginUser,
};
