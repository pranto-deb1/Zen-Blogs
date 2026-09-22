import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const VerifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      message: "token verified successfully",
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      message: "error verifying token",
      error: error,
      data: null,
    };
  }
};

export const jwtUtils = {
  VerifyToken,
};
