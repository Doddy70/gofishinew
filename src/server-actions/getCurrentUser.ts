import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('DEBUG: GET_SESSION', session ? `FOUND: ${session.user.email}` : 'NOT FOUND');

  if (!session?.user.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  console.log('DEBUG: GET_USER', user ? `FOUND: ${user.name} (${user.role})` : 'NOT FOUND');

  return user;
}
