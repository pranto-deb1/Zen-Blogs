import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


const VerifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

export const jwtUtils = {
  VerifyToken,
};
