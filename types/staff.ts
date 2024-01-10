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
    subjectIds?: string,
}

export interface UpdateStaff extends CreateStaff {
    id: string | undefined,
}

export interface Staff extends CreateStaff {
    id: string | undefined,
    photoFn?: string | undefined,
}


export enum CreateStaffResponse {
    Success = 'Staff member has been added.',
    Duplicated = 'Email already exists.',
    RoleNotFound = 'Role not found.'
}

export enum UpdateStaffResponse {
    Success = 'Staff member has been updated.',
    Duplicated = 'Email already exists.',
    RoleNotFound = 'Role not found.',
    StaffNotFound = 'Staff member not found.'
}

export enum DeleteStaffResponse {
    Success = 'Staff member has been deleted.',
    StaffNotFound = 'Staff member not found.'
}

export type GetOneStaffResponse = Omit<Staff, 'photoFn'> | null
export type GetPaginatedListOfStaff = PaginatedList<GetOneStaffResponse>