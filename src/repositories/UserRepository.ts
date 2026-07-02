import prisma from "@/lib/prisma";

export class UserRepository {
  async updateKaptenStatus(userId: string, status: "APPROVED" | "REJECTED") {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hostStatus: status,
      },
    });
  }

  async findPendingKaptens() {
    return await prisma.user.findMany({
      where: {
        hostStatus: "PENDING",
      },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
            boatType: true,
            legalDocs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

// Export a singleton instance for standard use
export const userRepository = new UserRepository();
