import { apiClient } from './client'
import type { Plan } from '../types'

export async function getPlans(): Promise<Plan[]> {
  return apiClient.get('/plans')
}

export async function getPlan(id: number): Promise<Plan | null> {
  return apiClient.get(`/plans/${id}`)
}

export async function createPlan(data: Partial<Plan>) {
  return apiClient.post('/plans', data)
}

export async function updatePlan(id: number, data: Partial<Plan>) {
  return apiClient.patch(`/plans/${id}`, data)
}

export async function deletePlan(id: number) {
  return apiClient.delete(`/plans/${id}`)
}
