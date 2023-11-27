export interface Login {
    email: string,
    password: string,
}

export enum LoginResponse {
    Success = 'Successfully logged.',
    Failure = 'Log in failed.'
}

export enum LogoutResponse {
    Success = 'Successfully logged out.',
    Failure = 'Log out failed.'
}