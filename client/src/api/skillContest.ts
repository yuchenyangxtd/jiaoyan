import { apiClient } from './client'

export const skillContestApi = {
  list: () => apiClient.get('/skill-contests'),
  get: (id: number) => apiClient.get(`/skill-contests/${id}`),
  create: (data: any) => apiClient.post('/skill-contests', data),
  update: (id: number, data: any) => apiClient.patch(`/skill-contests/${id}`, data),
  delete: (id: number) => apiClient.delete(`/skill-contests/${id}`),
}
