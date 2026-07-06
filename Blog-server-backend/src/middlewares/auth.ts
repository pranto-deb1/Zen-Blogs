import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utility/catchAsync/catchAsync";
import { CreateErrorRes } from "../utility/errorHelpers/errorHelpers";
import { config } from "../config";
import { jwtUtils } from "../utility/jwt/jwt";
import { prisma } from "../lib/prisma";
import { ActiveStatus, Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (roles: string[]) => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.accessToken
      ? req.cookies?.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json(CreateErrorRes("Unauthorized. Please login", 401));
    }


    const verifiedToken = jwtUtils.VerifyToken(token, config.jwt_access_secret);

    const { id, name, email, role } = verifiedToken;

    if (!roles.includes(role)) {
      return res
        .status(403)
        .json(
          CreateErrorRes(
            "Forbidden. You do not have permission to access this resource",
            403,
          ),
        );
    }

    const user = await prisma.user.findUnique({
      where: { id, name, email, role },
    });

    if (!user) {
      return res.status(404).json(CreateErrorRes("User not found", 404));
    }
    if (user.activeStatus === ActiveStatus.INACTIVE) {
      return res.status(403).json(CreateErrorRes("User is inactive", 403));
    }

    req.user = { id, name, email, role };
    next();
  });
};
