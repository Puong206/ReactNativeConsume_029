import apiClient from "../api/apiClient";

export class HewanRepositoryImpl implements IHewanRepository {
    async getAll(): Promise<APIResponse<Hewan[]>> {
        const response = await apiClient.get<APIResponse<Hewan[]>>('/hewan');
        return response.data;
    }
}