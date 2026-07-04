import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    // Check if user exists in database, create if not
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        favoriteIds: true,
        hostStatus: true,
      },
    });

    // If user doesn't exist in DB, create from Clerk data
    if (!user) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = clerkUser.firstName + " " + (clerkUser.lastName || "");
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
            favoriteIds: true,
            hostStatus: true,
          },
        });
      }
    }

    return user;
  } catch (error) {
    console.error("[getCurrentUser] Error:", error);
    return null;
  }
}
