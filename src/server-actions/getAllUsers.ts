import prisma from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return [];
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            listings: true,
            reservations: true,
          }
        }
      }
    });

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
}
