"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useCatalogos } from "@/hooks/useCatalogos";
import { useDeleteCatalogo } from "@/hooks/useDeleteCatalogo";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { CAN_DELETE_CATALOGOS } from "@/types/auth";
import type { Role } from "@/types/auth";
import type { CatalogosListParams } from "@/types/catalogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_LIMIT = 20;
const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

type CatalogosListProps = {
  className?: string;
};

/**
 * Renders the catalog list with search, filters, and pagination.
 * Uses the GET /catalogos API with query params: sector, q, name, mimeType, createdFrom, createdTo, page, limit.
 */
export function CatalogosList({ className }: CatalogosListProps) {
  const [name, setName] = useState("");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [applied, setApplied] = useState<CatalogosListParams>({});

  const params: CatalogosListParams = {
    ...applied,
    page,
    limit,
  };

  const { data, isLoading, isError, error } = useCatalogos(params);
  const { data: profile } = useCurrentUserProfile();
  const deleteCatalogo = useDeleteCatalogo();
  const canDelete =
    profile?.role != null &&
    CAN_DELETE_CATALOGOS.includes(profile.role as Role);

  const handleApplyFilters = useCallback(() => {
    setApplied({
      ...(name.trim() && { name: name.trim() }),
      ...(q.trim() && { q: q.trim() }),
      ...(sector.trim() && { sector: sector.trim() }),
      ...(mimeType.trim() && { mimeType: mimeType.trim() }),
      ...(createdFrom && { createdFrom }),
      ...(createdTo && { createdTo }),
    });
    setPage(1);
  }, [name, q, sector, mimeType, createdFrom, createdTo]);

  const handleClearFilters = useCallback(() => {
    setName("");
    setQ("");
    setSector("");
    setMimeType("");
    setCreatedFrom("");
    setCreatedTo("");
    setApplied({});
    setPage(1);
  }, []);

  const { items, total } = data ?? { items: [], total: 0 };
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const handleDelete = (id: string, nameItem: string) => {
    if (!window.confirm(`Excluir o catálogo "${nameItem}"? Esta ação não pode ser desfeita.`)) return;
    deleteCatalogo.mutate(id);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and filters */}
      <div className="rounded-md border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="space-y-1.5">
            <label htmlFor="filter-name" className="text-muted-foreground text-xs font-medium">
              Nome
            </label>
            <Input
              id="filter-name"
              placeholder="Nome do catálogo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-q" className="text-muted-foreground text-xs font-medium">
              Busca no texto
            </label>
            <Input
              id="filter-q"
              placeholder="Conteúdo do PDF"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-sector" className="text-muted-foreground text-xs font-medium">
              Setor
            </label>
            <Input
              id="filter-sector"
              placeholder="Ex.: vendas, financeiro"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-mime" className="text-muted-foreground text-xs font-medium">
              Tipo MIME
            </label>
            <Input
              id="filter-mime"
              placeholder="Ex.: application/pdf"
              value={mimeType}
              onChange={(e) => setMimeType(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-created-from" className="text-muted-foreground text-xs font-medium">
              Criado de
            </label>
            <Input
              id="filter-created-from"
              type="date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="filter-created-to" className="text-muted-foreground text-xs font-medium">
              Criado até
            </label>
            <Input
              id="filter-created-to"
              type="date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={handleApplyFilters} size="sm">
            Filtrar
          </Button>
          <Button onClick={handleClearFilters} variant="outline" size="sm">
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando catálogos…
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive">
            Erro ao carregar: {error?.message ?? "Erro desconhecido"}
          </div>
        ) : (
          <>
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

            {/* Pagination */}
            {total > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
                <p className="text-muted-foreground text-sm">
                  Mostrando {from}–{to} de {total} catálogo(s)
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="pagination-limit" className="text-muted-foreground text-sm">
                    Por página:
                  </label>
                  <select
                    id="pagination-limit"
                    className="border-input bg-background rounded-md border px-2 py-1.5 text-sm"
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    {LIMIT_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Próxima
                    </Button>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    Página {page} de {totalPages}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
