"use client";

import { useState, useRef } from "react";
import { useUploadCatalogo } from "@/hooks/useUploadCatalogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPE = "application/pdf";

type CatalogoUploadFormProps = {
  className?: string;
};

/**
 * Form to upload a catalog PDF. Validates file type and size; handles API unavailable.
 */
export function CatalogoUploadForm({ className }: CatalogoUploadFormProps) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadCatalogo();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const chosen = e.target.files?.[0];
    if (!chosen) {
      setFile(null);
      return;
    }
    if (chosen.type !== ACCEPTED_TYPE) {
      setValidationError("Apenas arquivos PDF são permitidos.");
      setFile(null);
      return;
    }
    if (chosen.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(`Tamanho máximo: ${MAX_FILE_SIZE_MB} MB.`);
      setFile(null);
      return;
    }
    setFile(chosen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!file) {
      setValidationError("Selecione um arquivo PDF.");
      return;
    }
    upload.mutate(
      { file, name: name.trim() || undefined, sector: sector.trim() || undefined },
      {
        onError: (err) => {
          const message = err?.message ?? "";
          const isNetworkOrUnavailable =
            message.includes("Network Error") ||
            message.includes("ECONNREFUSED") ||
            (err as { response?: { status?: number } })?.response?.status === 503;
          if (isNetworkOrUnavailable) {
            setValidationError("API indisponível. Tente novamente quando o backend estiver no ar.");
          }
        },
      }
    );
  };

  const errorMessage = validationError ?? (upload.isError ? String(upload.error?.message) : null);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <h2 className="text-lg font-medium">Enviar PDF</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Arquivo (PDF, máx. {MAX_FILE_SIZE_MB} MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPE}
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-primary-foreground file:hover:bg-primary/90"
            />
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Nome (opcional)</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Catálogo 2024"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Setor (opcional)</label>
            <Input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ex.: Vendas"
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          {upload.isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">Catálogo enviado com sucesso.</p>
          )}
          <Button type="submit" disabled={!file || upload.isPending}>
            {upload.isPending ? "Enviando…" : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
