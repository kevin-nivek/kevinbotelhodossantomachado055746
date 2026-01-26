export interface PetsPage<T> {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
}
