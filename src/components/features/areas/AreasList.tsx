"use client";

import { useCallback, useEffect, useState } from "react";
import { useAreas } from "@/hooks/useAreas";
import { useArea } from "@/hooks/useArea";
import { useCreateArea } from "@/hooks/useCreateArea";
import { useUpdateArea } from "@/hooks/useUpdateArea";
import { useDeleteArea } from "@/hooks/useDeleteArea";
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

type AreasListProps = {
  className?: string;
};

function getValidationMessage(error: unknown): string {
  const err = error as { response?: { data?: { message?: string | string[] } } };
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(" ");
  if (typeof msg === "string") return msg;
  return "Verifique os dados e tente novamente.";
}

/**
 * Renders areas list with create, edit, and delete. Admin or manager only.
 */
export function AreasList({ className }: AreasListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDisplayOrder, setCreateDisplayOrder] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDisplayOrder, setEditDisplayOrder] = useState<string>("");

  const { data: areas = [], isLoading, isError, error } = useAreas({
    sortBy: "display_order",
    sortOrder: "asc",
  });
  const { data: editingArea } = useArea(editingId);
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const deleteArea = useDeleteArea();

  const handleStartCreate = useCallback(() => {
    setShowCreateForm(true);
    setCreateName("");
    setCreateDisplayOrder("");
  }, []);

  const handleCancelCreate = useCallback(() => {
    setShowCreateForm(false);
    setCreateName("");
    setCreateDisplayOrder("");
  }, []);

  const handleSubmitCreate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const name = createName.trim();
      if (!name) return;
      const displayOrder =
        createDisplayOrder.trim() === ""
          ? undefined
          : Number.parseInt(createDisplayOrder, 10);
      if (createDisplayOrder.trim() !== "" && Number.isNaN(displayOrder)) return;
      createArea.mutate(
        { name, displayOrder },
        {
          onSuccess: () => {
            handleCancelCreate();
          },
        }
      );
    },
    [createName, createDisplayOrder, createArea, handleCancelCreate]
  );

  const handleStartEdit = useCallback((id: string) => {
    setEditingId(id);
    setEditName("");
    setEditDisplayOrder("");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName("");
    setEditDisplayOrder("");
  }, []);

  useEffect(() => {
    if (editingId && editingArea && editingArea.id === editingId) {
      setEditName(editingArea.name);
      setEditDisplayOrder(
        editingArea.displayOrder != null ? String(editingArea.displayOrder) : ""
      );
    }
  }, [editingId, editingArea]);

  const handleSubmitEdit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingId) return;
      const name = editName.trim();
      if (!name) return;
      const displayOrder =
        editDisplayOrder.trim() === ""
          ? null
          : Number.parseInt(editDisplayOrder, 10);
      if (editDisplayOrder.trim() !== "" && (Number.isNaN(displayOrder) || displayOrder == null))
        return;
      updateArea.mutate(
        { id: editingId, payload: { name, displayOrder } },
        {
          onSuccess: () => {
            handleCancelEdit();
          },
        }
      );
    },
    [editingId, editName, editDisplayOrder, updateArea, handleCancelEdit]
  );

  const handleDelete = useCallback((id: string, areaName: string) => {
    if (
      !window.confirm(
        `Excluir a área "${areaName}"? Catálogos vinculados ficarão sem área.`
      )
    )
      return;
    deleteArea.mutate(id);
  }, [deleteArea]);

  const createError =
    createArea.isError ? getValidationMessage(createArea.error) : null;
  const editError =
    updateArea.isError ? getValidationMessage(updateArea.error) : null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <Button onClick={handleStartCreate} size="sm" disabled={showCreateForm}>
          Nova área
        </Button>
      </div>

      {showCreateForm && (
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Nova área
          </h3>
          <form
            onSubmit={handleSubmitCreate}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="create-area-name"
                className="text-muted-foreground text-xs font-medium"
              >
                Nome
              </label>
              <Input
                id="create-area-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Ex.: Área molhada"
                required
                className="min-w-[200px]"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="create-area-order"
                className="text-muted-foreground text-xs font-medium"
              >
                Ordem (opcional)
              </label>
              <Input
                id="create-area-order"
                type="number"
                value={createDisplayOrder}
                onChange={(e) => setCreateDisplayOrder(e.target.value)}
                placeholder="0"
                className="w-24"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={createArea.isPending}>
                {createArea.isPending ? "Salvando…" : "Criar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelCreate}
              >
                Cancelar
              </Button>
            </div>
          </form>
          {createError && (
            <p className="mt-2 text-sm text-destructive">{createError}</p>
          )}
        </div>
      )}

      {editingId && editingArea && (
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Editar área
          </h3>
          <form
            onSubmit={handleSubmitEdit}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="edit-area-name"
                className="text-muted-foreground text-xs font-medium"
              >
                Nome
              </label>
              <Input
                id="edit-area-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ex.: Dormitório"
                required
                className="min-w-[200px]"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="edit-area-order"
                className="text-muted-foreground text-xs font-medium"
              >
                Ordem (opcional)
              </label>
              <Input
                id="edit-area-order"
                type="number"
                value={editDisplayOrder}
                onChange={(e) => setEditDisplayOrder(e.target.value)}
                placeholder="—"
                className="w-24"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={updateArea.isPending}>
                {updateArea.isPending ? "Salvando…" : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            </div>
          </form>
          {editError && (
            <p className="mt-2 text-sm text-destructive">{editError}</p>
          )}
        </div>
      )}

      <div className="rounded-md border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando áreas…
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive">
            Erro ao carregar: {error?.message ?? "Erro desconhecido"}
          </div>
        ) : areas.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma área cadastrada. Use &quot;Nova área&quot; para criar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {area.displayOrder != null ? area.displayOrder : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(area.id)}
                        disabled={editingId !== null}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(area.id, area.name)}
                        disabled={deleteArea.isPending}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
