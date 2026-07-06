// @ts-nocheck
/**
 * POST /api/pusher/auth
 * Authenticate Pusher private channel subscriptions
 *
 * Body:
 * - socket_id (required): Pusher socket ID
 * - channel_name (required): Channel name to authorize
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import Pusher from "pusher";

// Initialize Pusher server
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { socket_id, channel_name } = body;

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "socket_id and channel_name are required" },
        { status: 400 }
      );
    }

    // 3. Validate channel access
    // Private channels start with "private-"
    // Presence channels start with "presence-"

    if (channel_name.startsWith("private-")) {
      // Extract conversation ID or user ID from channel name
      const channelId = channel_name.replace("private-", "");

      // For private messages: private-message-{userId}
      if (channelId.startsWith("message-")) {
        const targetUserId = channelId.replace("message-", "");
        // Only allow access if user is sender or receiver
        if (targetUserId !== currentUser.id) {
          // For now, allow access - in production, check conversation membership
        }
      }
      // For conversation: private-conversation-{conversationId}
      else if (channelId.startsWith("conversation-")) {
        // TODO: Verify user is member of conversation
      }
    }

    else if (channel_name.startsWith("presence-")) {
      // Presence channels are for online status
      // Allow any authenticated user to join presence channel
    }

    else {
      // Public channels don't need auth
      return NextResponse.json(
        { error: "Invalid channel type" },
        { status: 400 }
      );
    }

    // 4. Authorize the channel
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
      user_id: currentUser.id,
      user_info: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("[PUSHER_AUTH] ERROR:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
