import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const currentUser = await getCurrentUser();

    // Verifikasi Otoritas Admin yang Ketat
    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Akses Ditolak: Membutuhkan hak akses Administrator", { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Validasi data
    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return new NextResponse("Status tidak valid", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: resolvedParams.id
      },
      data: {
        hostStatus: status,
        // Jika disetujui, isVerified otomatis menjadi true
        isVerified: status === "APPROVED" ? true : false,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ADMIN_VERIFICATION_PATCH]", error);
    return new NextResponse("Terjadi kesalahan internal server", { status: 500 });
  }
}
