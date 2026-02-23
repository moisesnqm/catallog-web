"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalogo } from "@/hooks/useCatalogo";
import { useDeleteCatalogo } from "@/hooks/useDeleteCatalogo";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { CatalogoViewer } from "./CatalogoViewer";
import { CAN_DELETE_CATALOGOS } from "@/types/auth";
import type { Role } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogoViewContentProps = {
  catalogId: string;
};

/**
 * Wrapper that fetches catalog by ID and renders the viewer with title and back link.
 */
export function CatalogoViewContent({ catalogId }: CatalogoViewContentProps) {
  const router = useRouter();
  const { data: catalog, isLoading, isError, error } = useCatalogo(catalogId);
  const { data: profile } = useCurrentUserProfile();
  const deleteCatalogo = useDeleteCatalogo();
  const canDelete =
    profile?.role != null &&
    CAN_DELETE_CATALOGOS.includes(profile.role as Role);

  const handleDelete = () => {
    if (!catalog) return;
    if (!window.confirm(`Excluir o catálogo "${catalog.name}"? Esta ação não pode ser desfeita.`)) return;
    deleteCatalogo.mutate(catalogId, {
      onSuccess: () => router.push("/catalogos"),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className={cn("rounded-md border border-border bg-card p-8 text-center text-muted-foreground")}>
          Carregando catálogo…
        </div>
      </div>
    );
  }

  if (isError || !catalog) {
    return (
      <div className="p-6">
        <div className={cn("rounded-md border border-border bg-card p-8 text-center text-destructive")}>
          {error?.message ?? "Catálogo não encontrado."}
        </div>
        <Link href="/catalogos" className="mt-4 inline-block text-primary hover:underline">
          ← Voltar à listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href="/catalogos"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Catálogos
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">{catalog.name}</h1>
        {catalog.sector && (
          <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
            {catalog.sector}
          </span>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteCatalogo.isPending}
          >
            Excluir catálogo
          </Button>
        )}
      </div>
      <CatalogoViewer catalog={catalog} />
    </div>
  );
}
