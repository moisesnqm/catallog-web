/**
 * Role names used for RBAC. Backend must align with these.
 */
export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MANAGER: "manager",
  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LIST: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.VIEWER,
];

/**
 * Roles that can edit catalog metadata (name, sector, area).
 */
export const CAN_EDIT_CATALOGOS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
];

/**
 * Permissions: who can list catalogos (viewer+), who can upload (admin, manager, superadmin).
 * Delete: same as upload.
 */
export const CAN_LIST_CATALOGOS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.VIEWER,
];
export const CAN_UPLOAD_CATALOGOS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
];
export const CAN_DELETE_CATALOGOS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
];
export const CAN_MANAGE_AREAS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
  ROLES.MANAGER,
];

/**
 * Roles that can manage tenant users (link/unlink, list, update role/sector).
 * Admin-only feature.
 */
export const CAN_MANAGE_TENANT_USERS: Role[] = [
  ROLES.SUPERADMIN,
  ROLES.ADMIN,
];
