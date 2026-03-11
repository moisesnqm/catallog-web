import { Loader2 } from "lucide-react";

/**
 * Full-screen loading overlay shown during dashboard navigation (e.g. view catalog, change section).
 * Prevents repeated clicks while the next page is loading/compiling.
 */
export default function DashboardLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="size-10 animate-spin text-primary"
          aria-hidden
        />
        <span className="text-sm text-muted-foreground">Carregando…</span>
      </div>
    </div>
  );
}
