import type { AxiosInstance } from "axios";
import type { Area, AreasListParams, CreateAreaPayload, UpdateAreaPayload } from "@/types/area";
import { areaSchema } from "@/types/area";

/**
 * Fetches the list of areas for the current tenant.
 */
export async function fetchAreas(
  client: AxiosInstance,
  params?: AreasListParams
): Promise<Area[]> {
  const query: Record<string, string | undefined> = {
    sortBy: params?.sortBy ?? "display_order",
    sortOrder: params?.sortOrder ?? "asc",
  };
  const cleanParams = Object.fromEntries(
    Object.entries(query).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;
  const { data } = await client.get<Area[]>("/areas", { params: cleanParams });
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const parsed = areaSchema.safeParse(item);
    return parsed.success ? parsed.data : (item as Area);
  });
}

/**
 * Fetches a single area by ID.
 * @throws when API returns 404 or other error
 */
export async function fetchArea(
  client: AxiosInstance,
  id: string
): Promise<Area> {
  const { data } = await client.get<Area>(`/areas/${id}`);
  const parsed = areaSchema.safeParse(data);
  if (parsed.success) return parsed.data;
  return data;
}

/**
 * Creates an area for the current tenant. Admin or manager only.
 * @throws when API returns 403, 422 or other error
 */
export async function createArea(
  client: AxiosInstance,
  payload: CreateAreaPayload
): Promise<Area> {
  const { data } = await client.post<Area>("/areas", payload);
  return data;
}

/**
 * Updates an area by ID. Admin or manager only.
 * @throws when API returns 403, 404, 422 or other error
 */
export async function updateArea(
  client: AxiosInstance,
  id: string,
  payload: UpdateAreaPayload
): Promise<Area> {
  const { data } = await client.patch<Area>(`/areas/${id}`, payload);
  return data;
}

/**
 * Deletes an area by ID. Admin or manager only.
 * @throws when API returns 403, 404 or other error
 */
export async function deleteArea(
  client: AxiosInstance,
  id: string
): Promise<void> {
  await client.delete(`/areas/${id}`);
}
