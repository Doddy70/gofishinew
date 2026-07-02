import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import BoatModerationClient from "./BoatModerationClient";

export default async function BoatModerationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const boats = await prisma.listing.findMany({
    include: {
      rentalPackages: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return <BoatModerationClient boats={boats as any} />;
}
