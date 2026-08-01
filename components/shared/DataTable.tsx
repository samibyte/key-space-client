"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, FileX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api.type";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  meta,
  isLoading,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;
  const currentPage = meta?.page || 1;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  return (
    <Card className={cn("flex flex-col flex-1 overflow-hidden min-h-0 rounded-2xl shadow-sm border border-border/50", className)}>
      <div className="overflow-auto min-h-0 relative flex-1">
        <Table>
          <TableHeader className="bg-muted/40 sticky top-0 z-10">
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className="h-11 px-5 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border/30 hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-5 py-4">
                      <Skeleton className="h-4 w-3/4 max-w-50" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-52 text-center align-middle">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="size-14 rounded-full bg-muted/50 flex items-center justify-center ring-1 ring-border/40">
                      <FileX className="size-6 text-muted-foreground/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground/70">{emptyMessage}</p>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">No records match the current filter</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="border-b border-border/30 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-5 py-3.5 text-sm">
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {meta && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-muted/10 shrink-0">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{(currentPage - 1) * meta.limit + 1}</span>
            –
            <span className="font-medium text-foreground">{Math.min(currentPage * meta.limit, meta.total)}</span>
            {" "}of{" "}
            <span className="font-medium text-foreground">{meta.total}</span> results
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="size-8"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="w-8 text-center text-xs font-medium text-foreground">{currentPage}</span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="size-8"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
