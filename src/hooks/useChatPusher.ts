"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import PusherClient from "pusher-js";

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  createdAt: string | Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
  }>;
  lastMessage?: ChatMessage | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface UseChatPusherOptions {
  userId: string;
  conversationId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onTyping?: (data: { userId: string; userName: string; isTyping: boolean }) => void;
  enabled?: boolean;
}

export function useChatPusher({
  userId,
  conversationId,
  onNewMessage,
  onTyping,
  enabled = true,
}: UseChatPusherOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pusherRef = useRef<PusherClient | null>(null);
  const channelRef = useRef<ReturnType<PusherClient.prototype.subscribe> | null>(null);

  // Initialize Pusher connection
  useEffect(() => {
    if (!enabled || !userId) return;

    const initPusher = async () => {
      try {
        // Import Pusher dynamically
        const Pusher = (await import("pusher-js")).default;

        // Initialize with auth endpoint
        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
          authEndpoint: "/api/pusher/auth",
          auth: {
            params: {
              userId,
            },
          },
        });

        pusherRef.current.connection.bind("connected", () => {
          setIsConnected(true);
          setError(null);
        });

        pusherRef.current.connection.bind("disconnected", () => {
          setIsConnected(false);
        });

        pusherRef.current.connection.bind("error", (err: Error) => {
          console.error("[PUSHER_CONNECTION_ERROR]", err);
          setError(err.message || "Connection failed");
        });
      } catch (err) {
        console.error("[PUSHER_INIT_ERROR]", err);
        setError("Failed to initialize Pusher");
      }
    };

    initPusher();

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, [userId, enabled]);

  // Subscribe to conversation channel
  useEffect(() => {
    if (!enabled || !pusherRef.current || !conversationId) return;

    const channel = pusherRef.current.subscribe(
      `private-conversation-${conversationId}`
    );

    channel.bind("new-message", (data: ChatMessage) => {
      if (onNewMessage) {
        onNewMessage(data);
      }
    });

    channel.bind("typing", (data: { userId: string; userName: string; isTyping: boolean }) => {
      if (onTyping) {
        onTyping(data);
      }
    });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current?.unsubscribe(`private-conversation-${conversationId}`);
        channelRef.current = null;
      }
    };
  }, [conversationId, enabled, onNewMessage, onTyping]);

  // Send typing indicator
  const sendTyping = useCallback(
    async (isTyping: boolean) => {
      if (!conversationId) return;

      try {
        await fetch("/api/chat/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            isTyping,
          }),
        });
      } catch (err) {
        console.warn("[SEND_TYPING_ERROR]", err);
      }
    },
    [conversationId]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!conversationId) return;

      try {
        await fetch("/api/chat/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            messageId,
          }),
        });
      } catch (err) {
        console.warn("[MARK_READ_ERROR]", err);
      }
    },
    [conversationId]
  );

  return {
    isConnected,
    error,
    sendTyping,
    markAsRead,
  };
}

// Hook for real-time notifications
interface UseNotificationsPusherOptions {
  userId: string;
  onNewNotification?: (notification: {
    id: string;
    title: string;
    message: string;
    type: string;
  }) => void;
  enabled?: boolean;
}

export function useNotificationsPusher({
  userId,
  onNewNotification,
  enabled = true,
}: UseNotificationsPusherOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef<PusherClient | null>(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    const initPusher = async () => {
      try {
        const Pusher = (await import("pusher-js")).default;

        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
          authEndpoint: "/api/pusher/auth",
          auth: {
            params: { userId },
          },
        });

        pusherRef.current.connection.bind("connected", () => {
          setIsConnected(true);
        });

        // Subscribe to user's notification channel
        const channel = pusherRef.current.subscribe(`private-notifications-${userId}`);

        channel.bind("new-notification", (data: {
          id: string;
          title: string;
          message: string;
          type: string;
        }) => {
          if (onNewNotification) {
            onNewNotification(data);
          }
        });
      } catch (err) {
        console.error("[NOTIFICATIONS_PUSHER_ERROR]", err);
      }
    };

    initPusher();

    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, [userId, enabled, onNewNotification]);

  return { isConnected };
}
