import { Address } from "./address";
import { PaginatedList } from "./list";

export interface CreateStaff {
    name: string,
    surname: string,
    address: Address | string,
    email: string,
    phone: string,
    isVisible: boolean,
    description?: string,
    roleId?: string,
}

export interface Staff extends CreateStaff {
    id: string | undefined,
    photoFn: string | undefined,
}