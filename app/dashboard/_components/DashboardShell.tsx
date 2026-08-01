import { ReactNode } from "react";

interface DashboardShellProps {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export default function DashboardShell({
  title,
  description,
  headerAction,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background">
      {/* Header section */}
      <header className="shrink-0 border-b border-border/40 bg-card/30 backdrop-blur-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="mx-auto max-w-6xl w-full h-full flex flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
