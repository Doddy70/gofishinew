"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function approveListing(listingId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: "APPROVED" },
    });

    revalidatePath("/admin/inventory/listings");
    return { success: true };
  } catch (error) {
    console.error("[APPROVE_LISTING]", error);
    return { error: "Gagal menyetujui armada" };
  }
}

export async function updateListing(listingId: string, data: any) {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        passengerCapacity: Number(data.passengerCapacity),
        engine1: data.engine1,
        engine2: data.engine2,
        videoUrl: data.videoUrl,
      },
    });

    revalidatePath("/admin/inventory/listings");
    revalidatePath(`/listings/${listingId}`);
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_LISTING]", error);
    return { error: "Gagal memperbarui data armada" };
  }
}

export async function deleteListing(listingId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser?.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    revalidatePath("/admin/inventory/listings");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_LISTING]", error);
    return { error: "Gagal menghapus armada" };
  }
}
