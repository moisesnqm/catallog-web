import type { AxiosInstance } from "axios";
import type {
  CatalogosListResponse,
  CatalogosListParams,
  Catalogo,
  CatalogoUploadPayload,
} from "@/types/catalogo";
import { catalogosListResponseSchema } from "@/types/catalogo";

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
      params: { sector: params?.sector, page: params?.page, limit: params?.limit },
    });
    const parsed = catalogosListResponseSchema.safeParse(data);
    if (parsed.success) return parsed.data;
    return MOCK_CATALOGOS;
  } catch {
    return MOCK_CATALOGOS;
  }
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
