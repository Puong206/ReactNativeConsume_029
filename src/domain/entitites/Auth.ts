export interface User {
    id: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    data: User;
}