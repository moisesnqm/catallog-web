import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export const dynamic = "force-dynamic";

/**
 * Layout for authenticated dashboard: sidebar + main content.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
