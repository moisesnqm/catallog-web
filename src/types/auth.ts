/**
 * Role names used for RBAC. Backend must align with these.
 */
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LIST: Role[] = [ROLES.ADMIN, ROLES.MANAGER, ROLES.VIEWER];

/**
 * Permissions: who can list catalogos (viewer+), who can upload (admin, manager).
 * Delete: same as upload (admin, manager).
 */
export const CAN_LIST_CATALOGOS: Role[] = [ROLES.ADMIN, ROLES.MANAGER, ROLES.VIEWER];
export const CAN_UPLOAD_CATALOGOS: Role[] = [ROLES.ADMIN, ROLES.MANAGER];
export const CAN_DELETE_CATALOGOS: Role[] = [ROLES.ADMIN, ROLES.MANAGER];
