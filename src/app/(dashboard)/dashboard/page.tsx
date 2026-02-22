import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Dashboard home: welcome and quick links.
 */
export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Bem-vindo à Academy. Acesse os catálogos ou faça upload de novos
        arquivos PDF.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium">Catálogos</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Liste e visualize os catálogos disponíveis para seu setor.
            </p>
            <a
              href="/catalogos"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Ver catálogos →
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-medium">Upload</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Envie novos catálogos em PDF para a plataforma.
            </p>
            <a
              href="/catalogos/upload"
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              Fazer upload →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
