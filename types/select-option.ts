import { PaginatedList } from "./list";

export interface SelectOption {
    id: string;
    name: string;
}

export type GetPaginatedListOfSelectOptions = PaginatedList<SelectOption>