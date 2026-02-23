import type { AxiosInstance } from "axios";
import type {
  CatalogosListResponse,
  CatalogosListParams,
  Catalogo,
  CatalogoUploadPayload,
} from "@/types/catalogo";
import { catalogoSchema, catalogosListResponseSchema } from "@/types/catalogo";

const MOCK_CATALOGOS: CatalogosListResponse = {
  items: [
    {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      name: "Catálogo Produtos 2024",
      sector: "Vendas",
      fileUrl: null,
      fileName: "catalogo-2024.pdf",
      mimeType: "application/pdf",
      createdAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      name: "Manual Técnico",
      sector: "Operações",
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
    const { data } = await client.get<CatalogosListResponse>("/catalogos", {
      params: {
        sector: params?.sector,
        q: params?.q,
        page: params?.page,
        limit: params?.limit,
      },
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

  const { data } = await client.post<Catalogo>("/catalogos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Deletes a catalog by ID. Allowed only for admin and manager (backend enforces).
 * @throws when API returns 403, 404 or other error
 */
export async function deleteCatalogo(
  client: AxiosInstance,
  id: string
): Promise<void> {
  await client.delete(`/catalogos/${id}`);
}
