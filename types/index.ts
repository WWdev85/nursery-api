
export enum RoleType {
    Admin = 'admin',
    Staff = "staff",
}

export interface CreateRole {
    roleName: string,
    roleType: RoleType,
}

export interface Role extends CreateRole {
    id: string,
}