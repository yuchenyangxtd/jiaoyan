import { apiClient } from './client'

export const topicApi = {
  list: () => apiClient.get('/topics'),
  get: (id: number) => apiClient.get(`/topics/${id}`),
  create: (data: any) => apiClient.post('/topics', data),
  update: (id: number, data: any) => apiClient.patch(`/topics/${id}`, data),
  delete: (id: number) => apiClient.delete(`/topics/${id}`),
}
