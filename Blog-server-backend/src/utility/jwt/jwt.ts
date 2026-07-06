import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { CreateErrorRes } from "../errorHelpers/errorHelpers";
import { config } from "../../config";

const CreateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const VerifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {

    throw CreateErrorRes("Invalid token", 401);
  }
};





export const jwtUtils = {
  CreateToken,
  VerifyToken,
};
