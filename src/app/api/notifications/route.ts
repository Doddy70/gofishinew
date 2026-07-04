import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server-actions/getCurrentUser";

// In-memory notification storage for demo
// In production, this should be stored in the database
let notifications: any[] = [];
let notificationId = 1;

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get notifications for this user (mock - in production would query DB)
    const userNotifications = notifications.filter(
      n => n.userId === currentUser.id
    );

    const unreadCount = userNotifications.filter(n => !n.read).length;

    return NextResponse.json({
      notifications: userNotifications.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      unreadCount
    });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationId: notifId } = body;

    switch (action) {
      case 'markRead':
        // Mark all notifications as read
        notifications = notifications.map(n =>
          n.userId === currentUser.id ? { ...n, read: true } : n
        );
        break;

      case 'markOneRead':
        // Mark specific notification as read
        notifications = notifications.map(n =>
          n.id === notifId ? { ...n, read: true } : n
        );
        break;

      case 'clear':
        // Clear all notifications for user
        notifications = notifications.filter(n => n.userId !== currentUser.id);
        break;

      case 'create':
        // Create a new notification (for testing/demo)
        const newNotification = {
          id: `notif-${notificationId++}`,
          userId: currentUser.id,
          type: body.type || 'INFO',
          title: body.title || 'Notifikasi Baru',
          message: body.message || 'Anda memiliki notifikasi baru',
          data: body.data || {},
          read: false,
          createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        return NextResponse.json({ success: true, notification: newNotification });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTIFICATIONS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
