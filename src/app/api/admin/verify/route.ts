import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { NextResponse } from "next/server";
import { adminVerificationService } from "@/services/adminVerificationService";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    // 1. Authentication Check - CRITICAL SECURITY FIX
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // 2. Authorization Check - Admin Role Required
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Membutuhkan hak akses Administrator" },
        { status: 403 }
      );
    }

    // 3. Parse Request
    const body = await req.json();

    // 4. Call Service Layer (Handles Validation & Business Logic)
    const updatedUser = await adminVerificationService.verifyKapten(body);

    // 5. Return Response
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_VERIFY_PATCH]", error);

    // Explicit Error Boundary for Validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
