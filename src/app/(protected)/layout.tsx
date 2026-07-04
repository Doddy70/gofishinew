import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function GroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get auth state - will throw redirect if not authenticated
  const { userId } = await auth().catch(() => ({ userId: null }));

  // If no user, redirect to home page
  if (!userId) {
    redirect("/");
  }

  return <>{children}</>;
}
