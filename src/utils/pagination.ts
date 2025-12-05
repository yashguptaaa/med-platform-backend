export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const parsePaginationParams = (
  page?: string,
  limit?: string,
  defaultLimit = 10
): PaginationParams => {
  const parsedPage = Math.max(parseInt(page ?? "1", 10), 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit ?? `${defaultLimit}`, 10), 1), 100);

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const buildPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => {
  const totalPages = Math.ceil(total / limit) || 1;
  return { page, limit, total, totalPages };
};

export {
  parsePaginationParams,
  buildPaginationMeta,
};
