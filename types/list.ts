export enum Order {
    Asc = 'ASC',
    Desc = 'DESC',
}

export interface ListQuery {
    search: string;
    page: number;
    limit: number;
    orderBy: string;
    order: Order;
}

export type PaginatedList<T> = {
    items: T[];
    page: number;
    totalPages: number;
    totalItems: number;
}