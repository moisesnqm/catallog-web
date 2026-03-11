import { z } from "zod";

/** Single area from API. */
export const areaSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  displayOrder: z.number().int().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Area = z.infer<typeof areaSchema>;

/** Query params for GET /areas. */
export type AreasListSortBy = "display_order" | "name";
export type AreasListSortOrder = "asc" | "desc";

export interface AreasListParams {
  sortBy?: AreasListSortBy;
  sortOrder?: AreasListSortOrder;
}

/** Payload for POST /areas. */
export interface CreateAreaPayload {
  name: string;
  displayOrder?: number | null;
}

/** Payload for PATCH /areas/:id. */
export interface UpdateAreaPayload {
  name?: string;
  displayOrder?: number | null;
}
