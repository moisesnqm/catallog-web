"use client";

import { useUser } from "@clerk/nextjs";
import type { Role } from "@/types/auth";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";

type RequireRoleProps = {
  /** Roles that are allowed to see the content. */
  roles: Role[];
  children: React.ReactNode;
  /** Optional fallback when the user lacks the role (default: 403 message). */
  fallback?: React.ReactNode;
};

/**
 * Renders children only if the current user has one of the allowed roles.
 * Role is read from the backend (GET /me) when available; otherwise from Clerk publicMetadata.role.
 */
export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { isLoaded: clerkLoaded, user } = useUser();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();

  const userRole: Role | null =
    (profile?.role as Role) ?? (user?.publicMetadata?.role as Role | undefined) ?? null;
  const allowed = user && userRole && roles.includes(userRole);

  const loading = !clerkLoaded || profileLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!allowed) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Acesso negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
