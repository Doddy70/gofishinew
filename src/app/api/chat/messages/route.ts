// @ts-nocheck
/**
 * GET /api/chat/messages?conversationId=xxx
 * Get messages for a conversation
 *
 * POST /api/chat/messages
 * Send a message in a conversation
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { z } from "zod";
import Pusher from "pusher";

// Initialize Pusher for real-time
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const MessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const cursor = searchParams.get("cursor");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: currentUser.id,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit + 1,
    });

    // Check if there are more messages
    const hasMore = messages.length > limit;
    const paginatedMessages = hasMore ? messages.slice(0, -1) : messages;

    // Mark messages as read
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

    return NextResponse.json({
      messages: paginatedMessages.reverse().map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        createdAt: msg.createdAt,
        isRead: msg.readBy.includes(currentUser.id),
      })),
      nextCursor: hasMore ? paginatedMessages[0]?.id : null,
    });
  } catch (error) {
    console.error("[CHAT_MESSAGES_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = MessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { conversationId, content } = validation.data;

    // Verify user is part of conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: {
            id: currentUser.id,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        content,
        readBy: [currentUser.id],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Trigger Pusher event
    try {
      await pusherServer.trigger(
        `private-conversation-${conversationId}`,
        "new-message",
        {
          id: message.id,
          content: message.content,
          sender: message.sender,
          createdAt: message.createdAt,
          isRead: false,
        }
      );

      // Also notify each participant
      for (const participant of conversation.participants) {
        if (participant.id !== currentUser.id) {
          await pusherServer.trigger(
            `private-message-${participant.id}`,
            "new-message",
            {
              conversationId,
              message,
            }
          );
        }
      }
    } catch (pusherError) {
      console.warn("[PUSHER_TRIGGER] Failed:", pusherError);
      // Don't fail the request if Pusher fails
    }

    return NextResponse.json(
      {
        id: message.id,
        content: message.content,
        sender: message.sender,
        createdAt: message.createdAt,
        isRead: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CHAT_MESSAGES_POST] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
