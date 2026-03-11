"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCatalogo } from "@/hooks/useCatalogo";
import { useAreas } from "@/hooks/useAreas";
import { useDeleteCatalogo } from "@/hooks/useDeleteCatalogo";
import { useUpdateCatalogo } from "@/hooks/useUpdateCatalogo";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { CatalogoViewer } from "./CatalogoViewer";
import {
  CAN_DELETE_CATALOGOS,
  CAN_EDIT_CATALOGOS,
} from "@/types/auth";
import type { Role } from "@/types/auth";
import { CATALOGO_NAME_MAX_LENGTH } from "@/types/catalogo";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SECTOR_OPTIONS = [
  "financeiro",
  "pcp",
  "producao",
  "vendas",
  "projeto",
] as const;

type CatalogoViewContentProps = {
  catalogId: string;
};

/**
 * Wrapper that fetches catalog by ID and renders the viewer with title and back link.
 * Admins, managers and superadmins can edit name, sector and area.
 */
export function CatalogoViewContent({ catalogId }: CatalogoViewContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: catalog, isLoading, isError, error } = useCatalogo(catalogId);
  const { data: profile } = useCurrentUserProfile();
  const { data: areas = [] } = useAreas({
    sortBy: "display_order",
    sortOrder: "asc",
  });
  const deleteCatalogo = useDeleteCatalogo();
  const updateCatalogo = useUpdateCatalogo();
  const canDelete =
    profile?.role != null &&
    CAN_DELETE_CATALOGOS.includes(profile.role as Role);
  const canEdit =
    profile?.role != null &&
    CAN_EDIT_CATALOGOS.includes(profile.role as Role);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editSector, setEditSector] = useState("");
  const [editAreaId, setEditAreaId] = useState("");
  const [editValidationError, setEditValidationError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (catalog) {
      setEditName(catalog.name);
      setEditSector(catalog.sector ?? "");
      setEditAreaId(catalog.areaId ?? "");
    }
  }, [catalog]);

  useEffect(() => {
    if (catalog && canEdit && searchParams.get("edit") === "1") {
      setIsEditing(true);
    }
  }, [catalog, canEdit, searchParams]);

  const handleDelete = () => {
    if (!catalog) return;
    if (!window.confirm(`Excluir o catálogo "${catalog.name}"? Esta ação não pode ser desfeita.`)) return;
    deleteCatalogo.mutate(catalogId, {
      onSuccess: () => router.push("/catalogos"),
    });
  };

  const handleStartEdit = () => {
    if (catalog) {
      setEditName(catalog.name);
      setEditSector(catalog.sector ?? "");
      setEditAreaId(catalog.areaId ?? "");
      setEditValidationError(null);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValidationError(null);
    if (catalog) {
      setEditName(catalog.name);
      setEditSector(catalog.sector ?? "");
      setEditAreaId(catalog.areaId ?? "");
    }
    router.replace(`/catalogos/${catalogId}`, { scroll: false });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditValidationError(null);
    const name = editName.trim();
    if (!name) {
      setEditValidationError("O nome é obrigatório.");
      return;
    }
    if (name.length > CATALOGO_NAME_MAX_LENGTH) {
      setEditValidationError(
        `O nome deve ter no máximo ${CATALOGO_NAME_MAX_LENGTH} caracteres.`
      );
      return;
    }
    updateCatalogo.mutate(
      {
        id: catalogId,
        payload: {
          name,
          sector: editSector.trim() || null,
          areaId: editAreaId.trim() || null,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: (err) => {
          const res = err as {
            response?: { status?: number; data?: { message?: string | string[] } };
          };
          if (res?.response?.status === 422) {
            const msg = res?.response?.data?.message;
            const text = Array.isArray(msg) ? msg.join(" ") : msg;
            if (typeof text === "string" && text) {
              setEditValidationError(text);
            }
          }
        },
      }
    );
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
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Link
          href="/catalogos"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Catálogos
        </Link>
        {!isEditing ? (
          <>
            <h1 className="text-2xl font-semibold text-foreground">
              {catalog.name}
            </h1>
            {catalog.sector && (
              <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                {catalog.sector}
              </span>
            )}
            {catalog.area && (
              <span className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
                {catalog.area.name}
              </span>
            )}
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleStartEdit}
                disabled={updateCatalogo.isPending}
                title="Editar"
                aria-label="Editar"
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
                disabled={deleteCatalogo.isPending}
                title="Excluir catálogo"
                aria-label="Excluir catálogo"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </>
        ) : (
          <form
            onSubmit={handleSubmitEdit}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="edit-catalogo-name"
                className="text-muted-foreground text-xs font-medium"
              >
                Nome
              </label>
              <Input
                id="edit-catalogo-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nome do catálogo"
                required
                maxLength={CATALOGO_NAME_MAX_LENGTH}
                className="min-w-[200px]"
              />
              <p className="text-muted-foreground text-xs">
                Máx. {CATALOGO_NAME_MAX_LENGTH} caracteres
              </p>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="edit-catalogo-sector"
                className="text-muted-foreground text-xs font-medium"
              >
                Setor
              </label>
              <select
                id="edit-catalogo-sector"
                value={editSector}
                onChange={(e) => setEditSector(e.target.value)}
                className={cn(
                  "border-input h-9 min-w-[140px] rounded-md border bg-transparent px-3 py-1 text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                )}
              >
                <option value="">Nenhum</option>
                {SECTOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="edit-catalogo-area"
                className="text-muted-foreground text-xs font-medium"
              >
                Área
              </label>
              <select
                id="edit-catalogo-area"
                value={editAreaId}
                onChange={(e) => setEditAreaId(e.target.value)}
                className={cn(
                  "border-input h-9 min-w-[140px] rounded-md border bg-transparent px-3 py-1 text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                )}
              >
                <option value="">Nenhuma</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={updateCatalogo.isPending}>
                {updateCatalogo.isPending ? "Salvando…" : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={updateCatalogo.isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
      {(editValidationError ||
        (updateCatalogo.isError && !editValidationError)) && (
        <p className="mb-2 text-sm text-destructive">
          {editValidationError ??
            (updateCatalogo.error?.message ?? "Erro ao salvar.")}
        </p>
      )}
      <CatalogoViewer catalog={catalog} />
    </div>
  );
}
