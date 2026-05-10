import { apiClient } from './client'

export const competitionApi = {
  list: () => apiClient.get('/competitions'),
  get: (id: number) => apiClient.get(`/competitions/${id}`),
  create: (data: any) => apiClient.post('/competitions', data),
  update: (id: number, data: any) => apiClient.patch(`/competitions/${id}`, data),
  delete: (id: number) => apiClient.delete(`/competitions/${id}`),
}
