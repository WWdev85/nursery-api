export interface Login {
    email: string,
    password: string,
}

export enum LoginResponse {
    Success = 'Fuccessfully logged.',
    Failure = 'Log out failed.'
}

export enum LogoutResponse {
    Success = 'Fuccessfully logged out.',
    Failure = 'Log out failed.'
}