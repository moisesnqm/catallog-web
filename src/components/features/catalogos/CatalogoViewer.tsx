"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "@/lib/api/client";
import { fetchCatalogoFile } from "@/lib/api/catalogos";
import type { Catalogo } from "@/types/catalogo";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/** PDF.js worker: use CDN so it works in Next.js without bundling the worker file. */
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type CatalogoViewerProps = {
  /** Catalog metadata (id and fileUrl for fallback). */
  catalog: Catalogo;
};

/**
 * Renders the catalog PDF in-app with restrictions: no save button, print disabled,
 * context menu disabled, and selection disabled to discourage copying/screenshots.
 */
export function CatalogoViewer({ catalog }: CatalogoViewerProps) {
  const { getToken } = useAuth();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {};
      if (typeof width === "number" && width > 0) setPageWidth(width);
    });
    observer.observe(el);
    setPageWidth(el.clientWidth);
    return () => observer.disconnect();
  }, [pdfUrl]);

  useEffect(() => {
    setLoadError(null);
    let cancelled = false;

    async function load() {
      try {
        const blob = await fetchCatalogoFile(client, catalog.id);
        if (cancelled) return;
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setPdfUrl(url);
      } catch {
        if (catalog.fileUrl) {
          try {
            const res = await fetch(catalog.fileUrl, {
              method: "GET",
              credentials: "omit",
            });
            if (!res.ok) throw new Error("Falha ao carregar arquivo");
            const blob = await res.blob();
            if (cancelled) return;
            if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
            const url = URL.createObjectURL(blob);
            blobUrlRef.current = url;
            setPdfUrl(url);
          } catch {
            if (!cancelled) setLoadError("Não foi possível carregar o arquivo do catálogo.");
          }
        } else {
          if (!cancelled) setLoadError("Arquivo não disponível para este catálogo.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setPdfUrl(null);
    };
  }, [client, catalog.id, catalog.fileUrl, getToken]);

  useEffect(() => {
    const handleBeforePrint = () => {
      const root = document.querySelector(".catalogo-viewer-root");
      if (root) (root as HTMLElement).style.setProperty("visibility", "hidden");
    };
    const handleAfterPrint = () => {
      const root = document.querySelector(".catalogo-viewer-root");
      if (root) (root as HTMLElement).style.removeProperty("visibility");
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  if (loadError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-md border border-border bg-muted/30 p-8 text-center text-muted-foreground">
        {loadError}
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-md border border-border bg-muted/30 p-8 text-center text-muted-foreground">
        Carregando…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="catalogo-viewer-root w-full select-none overflow-auto rounded-md border border-border bg-[#525659]"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        @media print {
          .catalogo-viewer-root,
          .catalogo-viewer-root * {
            visibility: hidden !important;
          }
          body::after {
            content: "Impressão desabilitada.";
            visibility: visible !important;
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 1rem;
          }
        }
      `}</style>
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages: n }) => setNumPages(n)}
        onLoadError={() => setLoadError("Erro ao carregar o PDF.")}
        loading={
          <div className="flex min-h-[400px] items-center justify-center text-white">
            Carregando PDF…
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={pageWidth}
            className="mx-auto border-b border-white/10"
            renderTextLayer
            renderAnnotationLayer
          />
        ))}
      </Document>
    </div>
  );
}
