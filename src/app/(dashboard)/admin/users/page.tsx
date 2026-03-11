import { RequireRole } from "@/components/auth/RequireRole";
import { TenantUsersList } from "@/components/features/admin-users/TenantUsersList";
import { CAN_MANAGE_TENANT_USERS } from "@/types/auth";

/**
 * Admin page: link and manage users for the current tenant.
 * Only users with admin (or superadmin) role can access.
 */
export default function AdminUsersPage() {
  return (
    <RequireRole roles={CAN_MANAGE_TENANT_USERS}>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-foreground">
          Usuários do tenant
        </h1>
        <p className="mt-2 text-muted-foreground">
          Vincule ao tenant usuários que já existem no Clerk (cadastro por
          e-mail ou Google). Liste, altere função/setor e desvincule usuários.
        </p>
        <TenantUsersList className="mt-6" />
      </div>
    </RequireRole>
  );
}
