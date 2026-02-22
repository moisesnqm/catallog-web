import { RequireRole } from "@/components/auth/RequireRole";
import { CAN_UPLOAD_CATALOGOS } from "@/types/auth";
import { CatalogoUploadForm } from "@/components/features/catalogos/CatalogoUploadForm";

/**
 * Catalog upload page. Requires upload permission (admin or manager).
 */
export default function CatalogosUploadPage() {
  return (
    <RequireRole roles={CAN_UPLOAD_CATALOGOS}>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-foreground">
          Upload de catálogo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Envie um arquivo PDF. Nome e setor são opcionais.
        </p>
        <CatalogoUploadForm className="mt-6 max-w-lg" />
      </div>
    </RequireRole>
  );
}
