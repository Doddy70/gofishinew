import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Belum ada user di database. Silakan login (via Clerk) setidaknya 1 kali terlebih dahulu dengan kode 424242.",
      });
    }

    const targetUser = users[0]; // Promote the most recently created/logged in user
    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        role: "ADMIN",
        hostStatus: "APPROVED",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Sukses! User ${targetUser.email || targetUser.name} telah dipromosikan menjadi ADMIN dan KAPTEN (HOST). Silakan refresh browser Anda.`,
    });
  } catch (error) {
    console.error("[PROMOTE_API]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
