export interface PaginationPageViewModel {
  page: number;
  label: string;
  url: string;
  isCurrent: boolean;
}

export interface PaginationViewModel {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  previousUrl?: string;
  nextUrl?: string;
  pages: PaginationPageViewModel[];
}
