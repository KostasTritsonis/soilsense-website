import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "el"],
  defaultLocale: "en",
  localePrefix: "always",
});

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/en/sign-in(.*)",
  "/el/sign-in(.*)",
  "/en/sign-up(.*)",
  "/el/sign-up(.*)",
  "/en",
  "/el",
]);

export default clerkMiddleware(async (auth, req) => {
  // First, let next-intl handle the locale routing
  const intlResponse = intlMiddleware(req);

  // If the route is NOT a public route, apply Clerk's protection
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      // Extract locale from the URL for proper redirect
      const locale = req.nextUrl.pathname.split("/")[1] || "en";
      return Response.redirect(new URL(`/${locale}/sign-in`, req.url));
    }
  }

  return intlResponse;
});

export const config = {
  matcher: ["/((?!api|_next|_static|.*\\..*).*)"],
};
