"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, FolderOpen, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { getRoleLabel } from "@/lib/role-labels";
import type { Role } from "@/types/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalogos", label: "Catálogos", icon: FolderOpen },
  { href: "/catalogos/upload", label: "Upload", icon: Upload },
];

/**
 * Sidebar navigation for the dashboard area.
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const roleLabel =
    profile?.role != null ? getRoleLabel(profile.role as Role) : null;

  return (
    <aside className="flex w-56 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex flex-col gap-0.5 border-b border-sidebar-border px-4 py-3">
        <Link href="/dashboard" className="font-semibold text-sidebar-foreground">
          Academy
        </Link>
        {profileLoading && (
          <span className="text-xs text-muted-foreground">…</span>
        )}
        {!profileLoading && profile?.tenantName && (
          <span className="text-xs text-muted-foreground truncate" title={profile.tenantName}>
            {profile.tenantName}
          </span>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        <div className="flex flex-col gap-0.5 rounded-md px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Conta</span>
            <UserButton afterSignOutUrl="/" />
          </div>
          {profileLoading && (
            <span className="text-xs text-muted-foreground">…</span>
          )}
          {!profileLoading && roleLabel != null && (
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          )}
        </div>
      </div>
    </aside>
  );
}
