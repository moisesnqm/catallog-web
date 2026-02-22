import type { AxiosInstance } from "axios";
import type { CurrentUserProfile } from "@/types/user";
import { currentUserProfileSchema } from "@/types/user";

/**
 * Fetches the current user profile (role, tenantId) from the backend.
 * The backend resolves the user from the Clerk JWT and returns the record from its DB.
 */
export async function fetchCurrentUserProfile(
  client: AxiosInstance
): Promise<CurrentUserProfile | null> {
  try {
    const { data } = await client.get<unknown>("/me");
    const parsed = currentUserProfileSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
