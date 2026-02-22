"use client";

import { useCatalogos } from "@/hooks/useCatalogos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type CatalogosListProps = {
  className?: string;
};

/**
 * Renders the catalog list (table). Uses mock data when API is unavailable.
 */
export function CatalogosList({ className }: CatalogosListProps) {
  const { data, isLoading, isError, error } = useCatalogos();

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

  return (
    <div className={cn("rounded-md border border-border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Nenhum catálogo encontrado.
              </TableCell>
            </TableRow>
          ) : (
            items.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.sector ?? "—"}</TableCell>
                <TableCell>
                  {c.fileUrl ? (
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {c.fileName ?? "Abrir"}
                    </a>
                  ) : (
                    c.fileName ?? "—"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
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
