import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "better-auth/types";

export default async function authMiddleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

	// const isAuthPage = request.nextUrl.pathname.startsWith("/api/auth");
    // const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
    // const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

    // // Redirect to home if accessing dashboard/admin without session
	// if (!session && (isDashboardPage || isAdminPage)) {
	// 	return NextResponse.redirect(new URL("/", request.url));
	// }

    // // Role-based protection for /admin
    // if (session && isAdminPage && (session.user as any).role !== "ADMIN") {
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/admin/:path*"],
};
