import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  return (
    <div className="flex h-full">
      <DashboardSidebar role={currentUser.role as any} />
      <main className="flex-1 overflow-y-auto bg-gray-50 min-h-[calc(100vh-6rem)]">
        {children}
      </main>
    </div>
  );
}
