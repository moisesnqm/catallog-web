import { RequireRole } from "@/components/auth/RequireRole";
import { CAN_LIST_CATALOGOS } from "@/types/auth";
import { CatalogosList } from "@/components/features/catalogos/CatalogosList";

/**
 * Catalog list page. Requires list permission (viewer or above).
 */
export default function CatalogosPage() {
  return (
    <RequireRole roles={CAN_LIST_CATALOGOS}>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-foreground">Catálogos</h1>
        <p className="mt-2 text-muted-foreground">
          Listagem de catálogos disponíveis. Use os filtros e a paginação para
          refinar a busca.
        </p>
        <CatalogosList className="mt-6" />
      </div>
    </RequireRole>
  );
}
