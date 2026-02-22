import { z } from "zod";
import type { Role } from "@/types/auth";

/**
 * Current user profile returned by GET /me (role and tenant from backend).
 */
export const currentUserProfileSchema = z.object({
  role: z.enum(["admin", "manager", "viewer"]),
  tenantId: z.string().uuid(),
  tenantName: z.string().optional(),
  sector: z.string().optional(),
});

export type CurrentUserProfile = z.infer<typeof currentUserProfileSchema>;
