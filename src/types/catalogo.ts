import { z } from "zod";

/** Area summary embedded in catalog response. */
export const catalogoAreaSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

/** Single catalog item from API. */
export const catalogoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sector: z.string().optional().nullable(),
  areaId: z.string().uuid().optional().nullable(),
  area: catalogoAreaSchema.optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  fileName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  searchableText: z.string().optional().nullable(),
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
  /** Filter by sector (e.g. vendas, financeiro). */
  sector?: string;
  /** Filter by area (UUID). */
  areaId?: string;
  /** Full-text search over extracted PDF text (Portuguese). */
  q?: string;
  /** Partial, case-insensitive search by catalog name. */
  name?: string;
  /** Filter by MIME type (e.g. application/pdf). */
  mimeType?: string;
  /** Catalogs created from this date (ISO 8601). */
  createdFrom?: string;
  /** Catalogs created until this date (ISO 8601). */
  createdTo?: string;
  /** Page number (default: 1). */
  page?: number;
  /** Items per page (default: 20, max: 100). */
  limit?: number;
}

/** Payload for upload (form: file + name + sector + areaId). */
export interface CatalogoUploadPayload {
  file: File;
  name?: string;
  sector?: string;
  areaId?: string;
}

/**
 * Payload for PATCH /catalogos/:id (partial update).
 * All fields optional. name: 1–255 chars trimmed; sector: allowed value or null; areaId: tenant area UUID or null.
 */
export interface UpdateCatalogoPayload {
  name?: string;
  sector?: string | null;
  areaId?: string | null;
}

/** Max length for catalog name (backend constraint). */
export const CATALOGO_NAME_MAX_LENGTH = 255;
