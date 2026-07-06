// @ts-nocheck
/**
 * POST /api/chat/read
 * Mark messages as read
 *
 * Body:
 * - conversationId: Conversation ID
 * - messageId (optional): Specific message ID to mark as read
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import Pusher from "pusher";

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, messageId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Mark specific message or all messages in conversation
    if (messageId) {
      await prisma.message.update({
        where: { id: messageId },
        data: {
          readBy: {
            push: currentUser.id,
          },
        },
      });
    } else {
      // Mark all unread messages as read
      await prisma.message.updateMany({
        where: {
          conversationId,
          readBy: {
            has: currentUser.id,
          },
        },
        data: {
          readBy: {
            push: currentUser.id,
          },
        },
      });
    }

    // Trigger read event
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      "messages-read",
      {
        userId: currentUser.id,
        messageId,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_READ] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
