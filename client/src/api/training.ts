import { apiClient } from './client'

export const trainingApi = {
  list: () => apiClient.get('/trainings'),
  get: (id: number) => apiClient.get(`/trainings/${id}`),
  create: (data: any) => apiClient.post('/trainings', data),
  update: (id: number, data: any) => apiClient.patch(`/trainings/${id}`, data),
  delete: (id: number) => apiClient.delete(`/trainings/${id}`),
}
