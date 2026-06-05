import apiClient from '../api/apiClient';

export class AuthRepositoryImpl implements IAuthRepository {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    }
}