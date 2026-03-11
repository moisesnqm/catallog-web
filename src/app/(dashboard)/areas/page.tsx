import { RequireRole } from "@/components/auth/RequireRole";
import { AreasList } from "@/components/features/areas/AreasList";
import { CAN_MANAGE_AREAS } from "@/types/auth";

/**
 * Areas management page. Admin or manager only.
 */
export default function AreasPage() {
  return (
    <RequireRole roles={CAN_MANAGE_AREAS}>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-foreground">Áreas</h1>
        <p className="mt-2 text-muted-foreground">
          Classifique catálogos por área (ex.: Área molhada, Dormitório). A ordem
          define a exibição em listas e filtros.
        </p>
        <AreasList className="mt-6" />
      </div>
    </RequireRole>
  );
}
