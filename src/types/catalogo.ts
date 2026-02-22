import { z } from "zod";

/** Single catalog item from API. */
export const catalogoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sector: z.string().optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  fileName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  createdAt: z.string().datetime(),
});

export type Catalogo = z.infer<typeof catalogoSchema>;

/** API response for list catalogos. */
export const catalogosListResponseSchema = z.object({
  items: z.array(catalogoSchema),
  total: z.number().int().min(0),
});

export type CatalogosListResponse = z.infer<typeof catalogosListResponseSchema>;

/** Query params for GET /catalogos. */
export interface CatalogosListParams {
  sector?: string;
  page?: number;
  limit?: number;
}

/** Payload for upload (form: file + name + sector). */
export interface CatalogoUploadPayload {
  file: File;
  name?: string;
  sector?: string;
}
