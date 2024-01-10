import { PaginatedList } from 'types';

export interface CreateSubject {
    name: string,
};

export interface Subject extends CreateSubject {
    id: string | undefined,
};

export enum CreateSubjectResponse {
    Success = 'Subject has been added.',
    Duplicated = 'Subject name already exists.',
}

export enum UpdateSubjectResponse {
    Success = 'Subject has been updated.',
    Duplicated = 'Subject name already exists.',
    NotFound = 'Subject not found.',
}

export enum DeleteSubjectResponse {
    Success = 'Subject has been deleted.',
    NotFound = 'Subject notot found.',
}

export type GetSubjectListResponse = PaginatedList<Subject>