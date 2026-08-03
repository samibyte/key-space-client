export type ApiResponse<TData = unknown> =
  | {
      success: true;
      message: string;
      data: TData;
      meta?: PaginationMeta;
    }
  | {
      success: false;
      message: string;
      data?: never;
      meta?: never;
    };

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}
export interface ApiErrorResponse {
  success: false;
  message: string;
}
