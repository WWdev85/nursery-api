import { PaginatedList } from "./list";

export interface SubjectHours {
    subjectId: string;
    hours: number;
}

export interface CreateCurriculum {
    name: string;
    subjects?: SubjectHours[];
}

export interface Curriculum extends CreateCurriculum {
    id: string;
}

export enum CreateCurriculumResponse {
    Success = 'Curriculum has been added.',
    Duplicated = 'Curriculum name already exists.',
}

export enum UpdateCurriculumResponse {
    Success = 'Curriculum has been updated.',
    Duplicated = 'Curriculum name already exists.',
    NotFound = 'Curriculum not found.',
}

export enum DeleteCurriculumResponse {
    Success = 'Curriculum has been deleted.',
    NotFound = 'Curriculum notot found.',
}
export type GetOneCurriculumResponse = Curriculum
export type GetCurriculumListResponse = PaginatedList<GetOneCurriculumResponse>