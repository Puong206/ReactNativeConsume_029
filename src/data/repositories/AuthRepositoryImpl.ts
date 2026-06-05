import { AuthResponse, RegisterResponse } from '@/domain/entities/Auth';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';
import apiClient from '../api/apiClient';

export class AuthRepositoryImpl implements IAuthRepository {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    }

    async register(username: string, email: string, password: string): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>('/auth/register', { username, email, password });
        return response.data;
    }
}