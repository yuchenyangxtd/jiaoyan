import { apiClient } from './client'

export const statisticsApi = {
  dashboard: () => apiClient.get('/statistics/dashboard'),
  users: () => apiClient.get('/statistics/users'),
  plans: () => apiClient.get('/statistics/plans'),
  activities: () => apiClient.get('/statistics/activities'),
  materials: () => apiClient.get('/statistics/materials'),
  topics: () => apiClient.get('/statistics/topics'),
  competitions: () => apiClient.get('/statistics/competitions'),
  skillContests: () => apiClient.get('/statistics/skill-contests'),
  trainings: () => apiClient.get('/statistics/trainings'),
  resources: () => apiClient.get('/statistics/resources'),
}
