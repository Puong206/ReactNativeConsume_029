export interface User {
    id: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    data: User;
}