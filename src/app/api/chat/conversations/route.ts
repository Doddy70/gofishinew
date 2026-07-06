// @ts-nocheck
/**
 * GET /api/chat/conversations
 * Get all conversations for the current user
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: currentUser.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Format response with last message preview
    const formattedConversations = conversations.map((conv) => {
      const lastMessage = conv.messages[0];
      const otherParticipants = conv.participants.filter(
        (p) => p.id !== currentUser.id
      );

      return {
        id: conv.id,
        participants: otherParticipants,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt,
              isRead: lastMessage.readBy.includes(currentUser.id),
            }
          : null,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("[CHAT_CONVERSATIONS_GET] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
