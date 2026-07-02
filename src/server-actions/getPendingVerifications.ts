import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getPendingVerifications() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return [];
    }

    const pendingUsers = await prisma.user.findMany({
      where: {
        hostStatus: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return pendingUsers;
  } catch (error) {
    console.error(error);
    return [];
  }
}
