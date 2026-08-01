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
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  meta,
  isLoading,
  emptyMessage = "No data available",
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
    <Card className="flex flex-col flex-1 overflow-hidden min-h-0 rounded-2xl shadow-sm border border-border/60">
      <div className="overflow-auto min-h-0 relative">
        <Table>
          <TableHeader className="bg-muted/30 sticky top-0 z-10 isolate">
            <TableRow className="border-b-border/60 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className="h-12 px-5 whitespace-nowrap">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b-border/40 hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="p-4">
                      <Skeleton className="h-4 w-3/4 max-w-[200px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-48 text-center align-middle">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                    <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center">
                      <FileX className="size-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="border-b-border/40 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-5 py-3.5">
                      {col.render ? col.render(item) : (item as any)[col.key]}
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
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 bg-muted/10 shrink-0">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * meta.limit + 1}</span> to{" "}
            <span className="font-medium text-foreground">{Math.min(currentPage * meta.limit, meta.total)}</span> of{" "}
            <span className="font-medium text-foreground">{meta.total}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="size-8"
            >
              <ChevronLeft className="size-4" />
            </Button>
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
