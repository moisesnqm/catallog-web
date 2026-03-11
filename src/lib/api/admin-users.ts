import type { AxiosInstance } from "axios";
import type {
  TenantUserItem,
  LinkUserBody,
  UpdateTenantUserBody,
} from "@/types/admin-users";

/**
 * Fetches the list of users linked to the current tenant. Admin only.
 */
export async function fetchTenantUsers(
  client: AxiosInstance
): Promise<TenantUserItem[]> {
  const { data } = await client.get<TenantUserItem[]>("/admin/users");
  return Array.isArray(data) ? data : [];
}

/**
 * Links a user to the current tenant by email. Admin only.
 * @throws 404 when no user in Clerk with that email, 409 when already linked, 503 when CLERK_SECRET_KEY not set
 */
export async function linkUser(
  client: AxiosInstance,
  payload: LinkUserBody
): Promise<TenantUserItem> {
  const { data } = await client.post<TenantUserItem>("/admin/users/link", payload);
  return data;
}

/**
 * Updates role and/or sector_access of a tenant user. Admin only.
 */
export async function updateTenantUser(
  client: AxiosInstance,
  clerkUserId: string,
  payload: UpdateTenantUserBody
): Promise<TenantUserItem> {
  const { data } = await client.patch<TenantUserItem>(
    `/admin/users/by-clerk/${encodeURIComponent(clerkUserId)}`,
    payload
  );
  return data;
}

/**
 * Unlinks a user from the current tenant. Admin only.
 */
export async function unlinkTenantUser(
  client: AxiosInstance,
  clerkUserId: string
): Promise<void> {
  await client.delete(
    `/admin/users/by-clerk/${encodeURIComponent(clerkUserId)}`
  );
}
