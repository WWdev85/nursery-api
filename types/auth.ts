export interface Login {
    email: string,
    password: string,
}

export enum LoginResponse {
    Success = 'Fuccessfully logged.',
    Failure = 'Log in failed.'
}

export enum LogoutResponse {
    Success = 'Fuccessfully logged out.',
    Failure = 'Log out failed.'
}