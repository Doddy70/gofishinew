import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Clerk webhook events
type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    public_metadata: Record<string, any>;
    updated_at: string;
  };
};

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If no headers, error
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Error occurred", { status: 400 });
    }

    // Get raw body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[CLERK_WEBHOOK] Missing CLERK_WEBHOOK_SECRET");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const wh = new Webhook(secret);
    let event: ClerkWebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      console.error("[CLERK_WEBHOOK] Webhook verification failed:", err);
      return new NextResponse("Webhook verification failed", { status: 400 });
    }

    const { type, data } = event;

    // Handle different events
    switch (type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = data;
        const email = email_addresses?.[0]?.email_address;

        if (!email) {
          console.error("[CLERK_WEBHOOK] No email found for user:", id);
          break;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id,
              email,
              name: `${first_name || ""} ${last_name || ""}`.trim() || email.split("@")[0],
              image: image_url,
              emailVerified: true,
              role: "GUEST",
              hostStatus: "NONE",
              commissionRate: 10.0,
            },
          });
          console.log("[CLERK_WEBHOOK] User created:", id);
        }
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = data;
        const email = email_addresses?.[0]?.email_address;

        await prisma.user.update({
          where: { id },
          data: {
            email: email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || email?.split("@")[0],
            image: image_url,
            updatedAt: new Date(),
          },
        });
        console.log("[CLERK_WEBHOOK] User updated:", id);
        break;
      }

      case "user.deleted": {
        const { id } = data;

        if (id) {
          // Delete user from database (cascade will delete related data)
          await prisma.user.delete({
            where: { id },
          }).catch((err) => {
            console.error("[CLERK_WEBHOOK] Failed to delete user:", id, err);
          });
          console.log("[CLERK_WEBHOOK] User deleted:", id);
        }
        break;
      }

      case "session.created": {
        console.log("[CLERK_WEBHOOK] Session created for user:", data.id);
        break;
      }

      case "session.ended": {
        console.log("[CLERK_WEBHOOK] Session ended for user:", data.id);
        break;
      }

      default:
        console.log("[CLERK_WEBHOOK] Unhandled event type:", type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLERK_WEBHOOK] Error processing webhook:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Disable body parsing for webhook signature verification
export const dynamic = "force-dynamic";
