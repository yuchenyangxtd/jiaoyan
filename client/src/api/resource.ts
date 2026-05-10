import { apiClient } from './client'

export const resourceApi = {
  list: () => apiClient.get('/resources'),
  get: (id: number) => apiClient.get(`/resources/${id}`),
  create: (data: any) => apiClient.post('/resources', data),
  update: (id: number, data: any) => apiClient.patch(`/resources/${id}`, data),
  delete: (id: number) => apiClient.delete(`/resources/${id}`),
}
