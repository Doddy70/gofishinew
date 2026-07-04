import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  // Dashboard routes
  "/dashboard(.*)",
  "/dashboard/calendar(.*)",
  "/dashboard/settings(.*)",
  "/dashboard/reservations(.*)",
  "/dashboard/trips(.*)",
  "/dashboard/fishing-log(.*)",

  // User routes
  "/reservations(.*)",
  "/trips(.*)",
  "/favorites(.*)",
  "/properties(.*)",

  // Admin routes
  "/admin(.*)",

  // Checkout
  "/checkout(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // If route is protected, require authentication
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless needed
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk proxy paths
    "/__clerk/:path*",
  ],
};
