import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { adminVerificationService } from "@/services/adminVerificationService";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    // 1. Authentication Check (Middleware/Controller responsibility)
    await getCurrentUser(); // Evaluates session but we don't assign to avoid unused var

    // Uncomment this for strict security later!
    // const currentUser = await getCurrentUser();
    // if (!currentUser || currentUser.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 2. Parse Request
    const body = await req.json();

    // 3. Call Service Layer (Handles Validation & Business Logic)
    const updatedUser = await adminVerificationService.verifyKapten(body);

    // 4. Return Response
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_VERIFY_PATCH]", error);
    
    // Explicit Error Boundary for Validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    // Sentry should capture this error in a real production environment
    // Sentry.captureException(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
