import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import type { UserWithRole } from "@/types/listing";

// Cache user data for 60 seconds
const getCachedUser = unstable_cache(
  async (userId: string): Promise<UserWithRole | null> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          hostStatus: true,
          favoriteIds: true,
        },
      });
      return user as UserWithRole | null;
    } catch {
      return null;
    }
  },
  ["current-user"],
  { revalidate: 60, tags: ["user"] }
);

export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    // Try cache first
    let user = await getCachedUser(userId);

    // If user doesn't exist in DB, create from Clerk data
    if (!user) {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
      const image = clerkUser.imageUrl;

      if (email) {
        user = await prisma.user.create({
          data: {
            id: userId,
            email,
            name: name || email.split("@")[0],
            image,
            role: "GUEST",
            hostStatus: "NONE",
            emailVerified: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            hostStatus: true,
            favoriteIds: true,
          },
        }) as UserWithRole;
      }
    }

    return user;
  } catch (error) {
    console.error("[getCurrentUser] Error:", error);
    return null;
  }
}
