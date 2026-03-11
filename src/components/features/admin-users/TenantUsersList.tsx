"use client";

import { useCallback, useEffect, useState } from "react";
import { useTenantUsers } from "@/hooks/useTenantUsers";
import { useLinkUser } from "@/hooks/useLinkUser";
import { useUpdateTenantUser } from "@/hooks/useUpdateTenantUser";
import { useUnlinkTenantUser } from "@/hooks/useUnlinkTenantUser";
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
import type { TenantUserItem, TenantUserRole, SectorAccess } from "@/types/admin-users";
import {
  TENANT_USER_ROLES,
  SECTOR_ACCESS_OPTIONS,
  SECTOR_ACCESS_LABELS,
  TENANT_USER_ROLE_LABELS,
} from "@/types/admin-users";
import type { AxiosError } from "axios";

type TenantUsersListProps = {
  className?: string;
};

function getLinkErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ error?: string; details?: Record<string, unknown> }>;
  const status = err.response?.status;
  const body = err.response?.data;
  if (status === 404 || body?.error === "No user found with this email") {
    return "Nenhum usuário encontrado com este e-mail no Clerk. Verifique se o usuário já se cadastrou.";
  }
  if (status === 409 || body?.error === "User already linked to this tenant") {
    return "Este usuário já está vinculado a este tenant.";
  }
  if (status === 503 || body?.error?.includes("CLERK_SECRET_KEY")) {
    return "Vinculação por e-mail não está disponível no momento.";
  }
  if (status === 422) {
    const details = body?.details;
    if (details && typeof details === "object") {
      const messages = Object.entries(details).map(
        ([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`
      );
      return messages.join(" ");
    }
    return body?.error ?? "Dados inválidos. Verifique o e-mail.";
  }
  const msg = body?.error ?? err.message;
  return typeof msg === "string" ? msg : "Erro ao vincular usuário.";
}

function getUpdateErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ error?: string }>;
  const body = err.response?.data;
  return body?.error ?? err.message ?? "Erro ao atualizar.";
}

function formatCreatedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * Renders tenant users list with link form, edit role/sector, and unlink. Admin only.
 */
export function TenantUsersList({ className }: TenantUsersListProps) {
  const [linkEmail, setLinkEmail] = useState("");
  const [linkRole, setLinkRole] = useState<TenantUserRole>("viewer");
  const [linkSector, setLinkSector] = useState<SectorAccess>("all");
  const [editingUser, setEditingUser] = useState<TenantUserItem | null>(null);
  const [editRole, setEditRole] = useState<TenantUserRole>("viewer");
  const [editSector, setEditSector] = useState<SectorAccess>("all");

  const { data: users = [], isLoading, isError, error } = useTenantUsers();
  const linkUserMutation = useLinkUser();
  const updateUserMutation = useUpdateTenantUser();
  const unlinkUserMutation = useUnlinkTenantUser();

  const handleSubmitLink = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const email = linkEmail.trim().toLowerCase();
      if (!email) return;
      linkUserMutation.mutate(
        { email, role: linkRole, sector_access: linkSector },
        {
          onSuccess: () => {
            setLinkEmail("");
            setLinkRole("viewer");
            setLinkSector("all");
          },
        }
      );
    },
    [linkEmail, linkRole, linkSector, linkUserMutation]
  );

  const handleStartEdit = useCallback((user: TenantUserItem) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditSector(user.sector_access);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingUser(null);
  }, []);

  useEffect(() => {
    if (editingUser) {
      setEditRole(editingUser.role);
      setEditSector(editingUser.sector_access);
    }
  }, [editingUser]);

  const handleSubmitEdit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser) return;
      updateUserMutation.mutate(
        {
          clerkUserId: editingUser.clerk_user_id,
          payload: { role: editRole, sector_access: editSector },
        },
        {
          onSuccess: () => {
            setEditingUser(null);
          },
        }
      );
    },
    [editingUser, editRole, editSector, updateUserMutation]
  );

  const handleUnlink = useCallback(
    (user: TenantUserItem) => {
      const confirmMessage =
        "Desvincular este usuário do tenant? Ele perderá acesso a este tenant na aplicação.";
      if (!window.confirm(confirmMessage)) return;
      unlinkUserMutation.mutate(user.clerk_user_id);
    },
    [unlinkUserMutation]
  );

  const linkError = linkUserMutation.isError
    ? getLinkErrorMessage(linkUserMutation.error)
    : null;
  const editError = updateUserMutation.isError
    ? getUpdateErrorMessage(updateUserMutation.error)
    : null;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-md border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Vincular usuário por e-mail
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          O usuário deve já existir no Clerk (cadastro por e-mail ou Google).
        </p>
        <form
          onSubmit={handleSubmitLink}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="link-user-email"
              className="text-muted-foreground text-xs font-medium"
            >
              E-mail
            </label>
            <Input
              id="link-user-email"
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              placeholder="usuario@exemplo.com"
              required
              className="min-w-[220px]"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="link-user-role"
              className="text-muted-foreground text-xs font-medium"
            >
              Função
            </label>
            <select
              id="link-user-role"
              value={linkRole}
              onChange={(e) => setLinkRole(e.target.value as TenantUserRole)}
              className="flex h-9 min-w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {TENANT_USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {TENANT_USER_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="link-user-sector"
              className="text-muted-foreground text-xs font-medium"
            >
              Setor
            </label>
            <select
              id="link-user-sector"
              value={linkSector}
              onChange={(e) => setLinkSector(e.target.value as SectorAccess)}
              className="flex h-9 min-w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {SECTOR_ACCESS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {SECTOR_ACCESS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" size="sm" disabled={linkUserMutation.isPending}>
            {linkUserMutation.isPending ? "Vinculando…" : "Vincular"}
          </Button>
        </form>
        {linkError && (
          <p className="mt-2 text-sm text-destructive">{linkError}</p>
        )}
      </div>

      {editingUser && (
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Alterar função e setor
          </h3>
          <form
            onSubmit={handleSubmitEdit}
            className="flex flex-wrap items-end gap-4"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="edit-user-role"
                className="text-muted-foreground text-xs font-medium"
              >
                Função
              </label>
              <select
                id="edit-user-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as TenantUserRole)}
                className="flex h-9 min-w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {TENANT_USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {TENANT_USER_ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="edit-user-sector"
                className="text-muted-foreground text-xs font-medium"
              >
                Setor
              </label>
              <select
                id="edit-user-sector"
                value={editSector}
                onChange={(e) => setEditSector(e.target.value as SectorAccess)}
                className="flex h-9 min-w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {SECTOR_ACCESS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {SECTOR_ACCESS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Salvando…" : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
            >
              Cancelar
            </Button>
          </form>
          {editError && (
            <p className="mt-2 text-sm text-destructive">{editError}</p>
          )}
        </div>
      )}

      <div className="rounded-md border border-border bg-card">
        <h3 className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
          Usuários vinculados ao tenant
        </h3>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando usuários…
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive">
            Erro ao carregar: {error?.message ?? "Erro desconhecido"}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum usuário vinculado. Use o formulário acima para vincular por
            e-mail.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-mail</TableHead>
                <TableHead>Identificador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Vinculado em</TableHead>
                <TableHead className="w-[180px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.email ?? "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user.clerk_user_id.length > 20
                      ? `…${user.clerk_user_id.slice(-12)}`
                      : user.clerk_user_id}
                  </TableCell>
                  <TableCell>{TENANT_USER_ROLE_LABELS[user.role]}</TableCell>
                  <TableCell>
                    {SECTOR_ACCESS_LABELS[user.sector_access]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCreatedAt(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(user)}
                        disabled={editingUser !== null}
                      >
                        Alterar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleUnlink(user)}
                        disabled={unlinkUserMutation.isPending}
                      >
                        Desvincular
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
