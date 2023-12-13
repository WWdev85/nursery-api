import { PaginatedList } from 'types';

export interface CreateRole {
    name: string,
};

export interface Role extends CreateRole {
    id: string | undefined,
    order: number,
};

export enum CreateRoleResponse {
    Success = 'Role has been added.',
    Duplicated = 'Role name already exists.',
}

export enum UpdateRoleResponse {
    Success = 'Role has been updated.',
    Duplicated = 'Role name already exists.',
    NotFound = 'Role not found.',
}

export enum DeleteRoleResponse {
    Success = 'Role has been deleted.',
    NotFound = 'Role notot found.',
}

export type GetRolesListResponse = PaginatedList<Role>