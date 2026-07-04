import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function GroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  return <>{children}</>;
}
