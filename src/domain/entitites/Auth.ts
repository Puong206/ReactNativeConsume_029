export interface Auth {
    id: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    data: User;
}