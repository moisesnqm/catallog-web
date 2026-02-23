"use client";

import Link from "next/link";
import { useCatalogos } from "@/hooks/useCatalogos";
import { useDeleteCatalogo } from "@/hooks/useDeleteCatalogo";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { CAN_DELETE_CATALOGOS } from "@/types/auth";
import type { Role } from "@/types/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogosListProps = {
  className?: string;
};

/**
 * Renders the catalog list (table). Uses mock data when API is unavailable.
 */
export function CatalogosList({ className }: CatalogosListProps) {
  const { data, isLoading, isError, error } = useCatalogos();
  const { data: profile } = useCurrentUserProfile();
  const deleteCatalogo = useDeleteCatalogo();
  const canDelete =
    profile?.role != null &&
    CAN_DELETE_CATALOGOS.includes(profile.role as Role);

  if (isLoading) {
    return (
      <div className={cn("rounded-md border border-border bg-card p-8 text-center text-muted-foreground", className)}>
        Carregando catálogos…
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("rounded-md border border-border bg-card p-8 text-center text-destructive", className)}>
        Erro ao carregar: {error?.message ?? "Erro desconhecido"}
      </div>
    );
  }

  const { items, total } = data ?? { items: [], total: 0 };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Excluir o catálogo "${name}"? Esta ação não pode ser desfeita.`)) return;
    deleteCatalogo.mutate(id);
  };

  return (
    <div className={cn("rounded-md border border-border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Data</TableHead>
            {canDelete && <TableHead className="w-[100px]">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canDelete ? 5 : 4} className="text-center text-muted-foreground">
                Nenhum catálogo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.sector ?? "—"}</TableCell>
                <TableCell>
                  <Link
                    href={`/catalogos/${c.id}`}
                    className="text-primary hover:underline"
                  >
                    Visualizar
                  </Link>
                  {c.fileName ? (
                    <span className="ml-2 text-muted-foreground text-sm">
                      ({c.fileName})
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
                {canDelete && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deleteCatalogo.isPending}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {total > 0 && (
        <p className="border-t border-border px-4 py-2 text-sm text-muted-foreground">
          Total: {total} catálogo(s)
        </p>
      )}
    </div>
  );
}
