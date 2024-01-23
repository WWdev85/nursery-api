import { PaginatedList } from "./list";

export interface CreateGroup {
    name: string;
    teacherId?: string;
    curriculumId?: string
    adminIds?: string[];
}

export interface Group extends CreateGroup {
    id: string;
    photoFn?: string | undefined,
}

export enum CreateGroupResponse {
    Success = 'Group has been added.',
    Duplicated = 'Group name already exists.',
    TeacherNotFound = 'Teacher not found.',
    CurriculumNotFound = 'Curriculum not found.'
}

export enum UpdateGroupResponse {
    Success = 'Group has been updated.',
    Duplicated = 'Group name already exists.',
    GroupNotFound = 'Group not found',
    TeacherNotFound = 'Teacher not found.',
    CurriculumNotFound = 'Curriculum not found.'
}

export enum DeleteGroupResponse {
    Success = 'Group  has been deleted.',
    StaffNotFound = 'Group  not found.'
}

export type GetOneGroupResponse = Omit<Group, 'photoFn'> | null;
export type GetPaginatedListOfGroups = PaginatedList<GetOneGroupResponse>