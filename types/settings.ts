export interface CreateSettings {
    appName: string;
    firstColor: string;
    secondColor: string;
    logo?: Express.Multer.File;
};

export interface Settings extends CreateSettings {
    id: string;
    logoFn: string
};

export type GetSettingsResponse = Omit<Settings, 'logoFn'> | null;

export enum UpdateSettingsResponse {
    Success = 'Settings has been updated.',
    Failure = 'Error.'
};

