import { RequireRole } from "@/components/auth/RequireRole";
import { CAN_LIST_CATALOGOS } from "@/types/auth";
import { CatalogoViewContent } from "@/components/features/catalogos/CatalogoViewContent";

type CatalogViewPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Catalog view page. Displays the catalog PDF in-app with restricted actions (no save, no print).
 * Requires list permission (viewer or above).
 */
export default async function CatalogViewPage({ params }: CatalogViewPageProps) {
  const { id } = await params;

  return (
    <RequireRole roles={CAN_LIST_CATALOGOS}>
      <CatalogoViewContent catalogId={id} />
    </RequireRole>
  );
}
