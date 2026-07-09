import { config } from "../../config";
import {
  ICreateUser,
  ILoginUser,
  IUpdateUser,
} from "../../interfaces/auth.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";
import bcrypt from "bcrypt";
import { jwtUtils } from "../../utility/jwt/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ActiveStatus } from "../../../generated/prisma/enums";

// create user and profile
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

// login user
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw CreateErrorRes("User not found", 404);
  }

  if (user.activeStatus === "INACTIVE") {
    throw CreateErrorRes("User is inactive", 403);
  }

  const comparedPassword = await bcrypt.compare(password, user.password);

  // check user password
  if (!comparedPassword) {
    throw CreateErrorRes("Invalid Password", 403);
  }

  // create jwt access and refresh token
  const jwtPayload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  const refreshToken = jwtUtils.CreateToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return { accessToken, refreshToken };
};

// update user & profile
const updateProfile = async (payload: IUpdateUser, userId: string) => {
  const { name, email, bio, profilePhoto } = payload;

  // create an object to hold the update data
  const updateData: any = {};

  // check if name, email, bio or profilePhoto is provided and add it to the updateData object
  if (name) updateData.name = name;
  if (email) {
    const chekIfUserEmailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (chekIfUserEmailExists && chekIfUserEmailExists.id !== userId) {
      throw CreateErrorRes("Another user with this email already exists", 409);
    }
    updateData.email = email;
  }
  if (bio || profilePhoto) {
    updateData.profile = {
      update: {},
    };
    if (bio) updateData.profile.update.bio = bio;
    if (profilePhoto) updateData.profile.update.profilePhoto = profilePhoto;
  }

  // update user and profile
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    omit: { password: true },
    include: { profile: true },
  });

  // return the updated user
  return updatedUser;
};

// generate new access token using refresh token
const refreshToken = async (refreshToken: string) => {
  // check if token exists
  if (!refreshToken) {
    throw CreateErrorRes("Refresh token is required", 401);
  }

  // verify the token
  const verifiedToken = jwtUtils.VerifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  // find user and conform it exists
  const { id } = verifiedToken;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw CreateErrorRes("Could not find user", 404);
  }

  if (user.activeStatus !== ActiveStatus.ACTIVE) {
    throw CreateErrorRes("Your account is not active.", 403);
  }

  // set up payload for jwt token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // create access token
  const accessToken = jwtUtils.CreateToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  // return token
  return accessToken;
};

// exporting the service functions
export const AuthService = {
  insertUser,
  loginUser,
  updateProfile,
  refreshToken,
};
