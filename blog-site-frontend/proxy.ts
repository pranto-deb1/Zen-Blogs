import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtUtils } from "./_components/utils/jtw";
import { getNewAccessToken } from "./services/refreshToken";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/", "/news"];

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value as string;
  const refreshToken = request.cookies.get("refreshToken")?.value as string;

  let decodedToken = accessToken
    ? jwtUtils.VerifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;
  let userRole = null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.VerifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  if (
    (!accessToken || !decodedToken?.success) &&
    decodedRefreshToken?.success
  ) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      accessToken = newAccessToken;
      decodedToken = accessToken
        ? jwtUtils.VerifyToken(
            accessToken,
            process.env.JWT_ACCESS_SECRET as string,
          )
        : null;
    }
  }

  if (decodedToken?.success && decodedToken.data) {
    userRole = decodedToken.data.role;
  }

  if (accessToken && authRoutes.includes(pathName)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const isPublic = publicRoutes.some(
    (route) => pathName === route || pathName.startsWith(route + "/"),
  );
  const isAuthRoutes = authRoutes.some(
    (route) => pathName === route || pathName.startsWith(route + "/"),
  );

  if (!accessToken && !isPublic && !isAuthRoutes) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken) {
    if (pathName.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
      if (userRole === "AUTHOR") {
        return NextResponse.redirect(new URL("/author-dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (
      pathName.startsWith("/author-dashboard") &&
      userRole !== "AUTHOR"
    ) {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (pathName.startsWith("/dashboard") && userRole !== "USER") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin-dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/author-dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
};
