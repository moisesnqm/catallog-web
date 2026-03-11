/**
 * Role for tenant user as returned/sent by admin users API (no superadmin).
 */
export type TenantUserRole = "admin" | "manager" | "viewer";

/**
 * Sector access for tenant user.
 */
export type SectorAccess =
  | "all"
  | "none"
  | "financeiro"
  | "pcp"
  | "producao"
  | "vendas"
  | "projeto";

/**
 * User linked to the current tenant (GET /admin/users).
 */
export interface TenantUserItem {
  id: string;
  clerk_user_id: string;
  tenant_id: string;
  role: TenantUserRole;
  sector_access: SectorAccess;
  created_at: string;
}

/**
 * Body for POST /admin/users/link.
 */
export interface LinkUserBody {
  email: string;
  role?: TenantUserRole;
  sector_access?: SectorAccess;
}

/**
 * Body for PATCH /admin/users/by-clerk/:clerkUserId.
 */
export interface UpdateTenantUserBody {
  role?: TenantUserRole;
  sector_access?: SectorAccess;
}

/** Role options for link/edit forms (API values). */
export const TENANT_USER_ROLES: TenantUserRole[] = [
  "viewer",
  "manager",
  "admin",
];

/** Sector access options for link/edit forms. */
export const SECTOR_ACCESS_OPTIONS: SectorAccess[] = [
  "all",
  "none",
  "financeiro",
  "pcp",
  "producao",
  "vendas",
  "projeto",
];

/** Display labels for sector access (pt-BR). */
export const SECTOR_ACCESS_LABELS: Record<SectorAccess, string> = {
  all: "Todos",
  none: "Nenhum",
  financeiro: "Financeiro",
  pcp: "PCP",
  producao: "Produção",
  vendas: "Vendas",
  projeto: "Projeto",
};

/** Display labels for tenant user role (pt-BR). */
export const TENANT_USER_ROLE_LABELS: Record<TenantUserRole, string> = {
  admin: "Admin",
  manager: "Gerente",
  viewer: "Visualizador",
};
