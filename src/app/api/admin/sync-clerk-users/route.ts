// @ts-nocheck
/**
 * POST /api/admin/sync-clerk-users
 * Sync Clerk users to database with roles
 *
 * Test credentials created:
 * - Admin:   admin@gofishi.com / Gofishi123
 * - Captain:  budi@gofishi.com / Gofishi123
 * - Guest:   guest@gofishi.com / Gofishi123
 */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

const TEST_USERS = {
  "admin@gofishi.com": { role: "ADMIN", hostStatus: "NONE", isVerified: true },
  "budi@gofishi.com": { role: "HOST", hostStatus: "APPROVED", isVerified: true },
  "guest@gofishi.com": { role: "GUEST", hostStatus: "NONE", isVerified: false },
};

export async function POST() {
  try {
    const clerk = await clerkClient();
    const clerkUsers = await clerk.users.getUserList();

    const results = {
      created: [] as string[],
      updated: [] as string[],
      errors: [] as string[],
    };

    for (const clerkUser of clerkUsers.data) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (!email) {
        results.errors.push(`No email for Clerk user: ${clerkUser.id}`);
        continue;
      }

      const testUserConfig = TEST_USERS[email as keyof typeof TEST_USERS];
      if (!testUserConfig) {
        continue; // Skip non-test users
      }

      const { role, hostStatus, isVerified } = testUserConfig;

      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { id: clerkUser.id }
      });

      if (existingUser) {
        // Update existing user
        await prisma.user.update({
          where: { id: clerkUser.id },
          data: {
            role,
            hostStatus,
            isVerified,
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
            image: clerkUser.imageUrl,
            emailVerified: true,
          }
        });
        results.updated.push(email);
      } else {
        // Create new user
        await prisma.user.create({
          data: {
            id: clerkUser.id,
            email,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email,
            image: clerkUser.imageUrl,
            emailVerified: true,
            role,
            hostStatus,
            isVerified,
            commissionRate: 10.0,
          }
        });
        results.created.push(email);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Clerk users synced to database",
      ...results,
    });
  } catch (error) {
    console.error("[SYNC_USERS]", error);
    return NextResponse.json(
      { error: "Failed to sync users" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clerk = await clerkClient();
    const clerkUsers = await clerk.users.getUserList();

    const users = clerkUsers.data.map(u => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    }));

    // Get database users
    const dbUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true, hostStatus: true }
    });

    return NextResponse.json({
      clerk: users,
      database: dbUsers,
      match: users.map(u => ({
        ...u,
        inDb: dbUsers.some(db => db.id === u.id)
      }))
    });
  } catch (error) {
    console.error("[SYNC_STATUS]", error);
    return NextResponse.json({ error: "Failed to check sync status" }, { status: 500 });
  }
}
