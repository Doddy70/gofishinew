// @ts-nocheck
/**
 * POST /api/chat/typing
 * Send typing indicator
 *
 * Body:
 * - conversationId: Conversation ID
 * - isTyping: Boolean
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
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

    const { conversationId, isTyping } = await req.json();

    if (!conversationId || isTyping === undefined) {
      return NextResponse.json(
        { error: "conversationId and isTyping are required" },
        { status: 400 }
      );
    }

    // Trigger typing event
    await pusherServer.trigger(
      `private-conversation-${conversationId}`,
      "typing",
      {
        userId: currentUser.id,
        userName: currentUser.name,
        isTyping,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHAT_TYPING] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send typing indicator" },
      { status: 500 }
    );
  }
}
