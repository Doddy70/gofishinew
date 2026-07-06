// @ts-nocheck
/**
 * POST /api/chat/conversations
 * Create a new conversation or get existing one
 *
 * Body:
 * - participantId (required): User ID to start conversation with
 * - initialMessage (optional): First message
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateConversationSchema = z.object({
  participantId: z.string().min(1),
  initialMessage: z.string().min(1).max(2000).optional(),
});

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
    const validation = CreateConversationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { participantId, initialMessage } = validation.data;

    // Can't chat with yourself
    if (participantId === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot start conversation with yourself" },
        { status: 400 }
      );
    }

    // Verify participant exists
    const participant = await prisma.user.findUnique({
      where: { id: participantId },
      select: { id: true, name: true, email: true, image: true },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check for existing conversation
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { id: currentUser.id },
            },
          },
          {
            participants: {
              some: { id: participantId },
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        id: existingConversation.id,
        isNew: false,
        participant,
      });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: currentUser.id }, { id: participantId }],
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
      },
    });

    // Add initial message if provided
    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: currentUser.id,
          content: initialMessage,
          readBy: [currentUser.id],
        },
      });
    }

    return NextResponse.json(
      {
        id: conversation.id,
        isNew: true,
        participant,
        participants: conversation.participants,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CHAT_CONVERSATION_CREATE] ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
