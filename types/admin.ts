import { GetOneStaffResponse } from "./staff";
import { PaginatedList } from "./list";

export enum AdminRole {
    SuperAdmin = 'superAdmin',
    GroupAdmin = 'groupAdmin',
}

export interface CreateAdmin {
    staffId: string,
    role: AdminRole,
    groupIds: string[],
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


export enum UpdateAdminResponse {
    Success = 'Administrator has been updated.',
    StaffNotFound = 'Staff mamber not exists.',
    AdminNotFound = 'Administrator not exists.',
    NotFound = "NotFound"
}

export type GetOneAdminResponse = {
    id: string;
    role: AdminRole;
    name: string;
    staff: GetOneStaffResponse
} | null

export type GetPaginatedListOfAdmins = PaginatedList<GetOneAdminResponse>

export enum SendCodeResponse {
    Success = 'Code has been sent',
    NotFound = 'Email not found',
}

export enum ValidateCodeResponse {
    Failure = 'Invalid code',
}

export enum ResetPasswordResponse {
    Success = 'Password has been changed',
    AdminNotFound = 'Administrator not exists',
    Failure = 'Password changing failed',
}

export enum UpdatePasswordResponse {
    Success = 'Password has been changed',
    Failure = 'Password changing failed',
}

export enum DeleteAdminResponse {
    Success = 'Admin has been deleted.',
    AdminNotFound = 'Administrator not exists.',
}

