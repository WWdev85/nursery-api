import { GetOneStaffResponse } from "./staff";
import { PaginatedList } from "./list";

export enum AdminRole {
    SuperAdmin = 'superAdmin',
    GroupAdmin = 'groupAdmin',
}

export interface CreateAdmin {
    staffId: string,
    role: AdminRole,
}

export interface Admin {
    id: string;
    email: string;
    currentTokenId: string | null;
    passwordHash: string;
    role: AdminRole,
}

export enum CreateAdminResponse {
    Success = 'Admin has been created.',
    StaffNotFound = 'Staff mambember not exists.',
}

export type GetOneAdminResponse = {
    id: string;
    role: AdminRole;
    staff: GetOneStaffResponse
} | null

export type GetPaginatedListOfAdmins = PaginatedList<GetOneAdminResponse>

export enum SendCodeResponse {
    Success = 'Code has been sent',
}

export enum ResetPasswordResponse {
    Success = 'Password has been changed',
    StaffNotFound = 'Staff mambember not exists',
    Failure = 'Password changing failed',
}