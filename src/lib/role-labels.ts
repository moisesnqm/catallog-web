import type { Role } from "@/types/auth";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Gerente",
  viewer: "Visualizador",
};

/**
 * Returns the display label in pt-BR for a given role.
 */
export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}
