import type { AxiosInstance } from "axios";
import type {
  CatalogosListResponse,
  CatalogosListParams,
  Catalogo,
  CatalogoUploadPayload,
  UpdateCatalogoPayload,
} from "@/types/catalogo";
import { catalogoSchema, catalogosListResponseSchema } from "@/types/catalogo";

const MOCK_CATALOGOS: CatalogosListResponse = {
  items: [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Catálogo Produtos 2024",
      sector: "Vendas",
      areaId: null,
      area: null,
      fileUrl: null,
      fileName: "catalogo-2024.pdf",
      mimeType: "application/pdf",
      createdAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      name: "Manual Técnico",
      sector: "Operações",
      areaId: null,
      area: null,
      fileUrl: null,
      fileName: "manual-tecnico.pdf",
      mimeType: "application/pdf",
      createdAt: "2024-02-01T14:30:00.000Z",
    },
  ],
  total: 2,
};

/**
 * Fetches the list of catalogos from the API. Returns mock data when API is unavailable.
 */
export async function fetchCatalogos(
  client: AxiosInstance,
  params?: CatalogosListParams
): Promise<CatalogosListResponse> {
  try {
    const query: Record<string, string | number | undefined> = {
      sector: params?.sector,
      areaId: params?.areaId,
      q: params?.q,
      name: params?.name,
      mimeType: params?.mimeType,
      createdFrom: params?.createdFrom,
      createdTo: params?.createdTo,
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
    };
    const cleanParams = Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== "")
    ) as Record<string, string | number>;
    const { data } = await client.get<CatalogosListResponse>("/catalogos", {
      params: cleanParams,
    });
    const parsed = catalogosListResponseSchema.safeParse(data);
    if (parsed.success) return parsed.data;
    return MOCK_CATALOGOS;
  } catch {
    return MOCK_CATALOGOS;
  }
}

/**
 * Fetches a single catalog by ID from the API.
 * @throws when API returns 404 or other error (caller should handle)
 */
export async function fetchCatalogo(
  client: AxiosInstance,
  id: string
): Promise<Catalogo> {
  const { data } = await client.get<Catalogo>(`/catalogos/${id}`);
  const parsed = catalogoSchema.safeParse(data);
  if (parsed.success) return parsed.data;
  return data;
}

/**
 * Fetches the catalog file (PDF) as a Blob for secure in-app viewing.
 * Prefer this over exposing fileUrl when backend supports GET /catalogos/:id/file.
 * @throws when API returns 404 or other error
 */
export async function fetchCatalogoFile(
  client: AxiosInstance,
  id: string
): Promise<Blob> {
  const { data } = await client.get<Blob>(`/catalogos/${id}/file`, {
    responseType: "blob",
  });
  return data;
}

/**
 * Uploads a catalog PDF. Fails with a descriptive error when API is unavailable.
 */
export async function uploadCatalogo(
  client: AxiosInstance,
  payload: CatalogoUploadPayload
): Promise<Catalogo> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.name) formData.append("name", payload.name);
  if (payload.sector) formData.append("sector", payload.sector);
  if (payload.areaId) formData.append("areaId", payload.areaId);

  const { data } = await client.post<Catalogo>("/catalogos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Updates catalog metadata (name, sector, areaId). Admin or manager only (backend).
 * 404 if catalog does not exist or belongs to another tenant.
 * 422 if validation fails or areaId not found / does not belong to tenant.
 * @throws when API returns 403, 404, 422 or other error
 */
export async function updateCatalogo(
  client: AxiosInstance,
  id: string,
  payload: UpdateCatalogoPayload
): Promise<Catalogo> {
  const { data } = await client.patch<Catalogo>(`/catalogos/${id}`, payload);
  const parsed = catalogoSchema.safeParse(data);
  if (parsed.success) return parsed.data;
  return data;
}

/**
 * Deletes a catalog by ID. Allowed only for admin, manager, superadmin (backend enforces).
 * @throws when API returns 403, 404 or other error
 */
export async function deleteCatalogo(
  client: AxiosInstance,
  id: string
): Promise<void> {
  await client.delete(`/catalogos/${id}`);
}
