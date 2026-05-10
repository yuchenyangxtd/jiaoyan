import { apiClient } from './client'
import type { Activity } from '../types'

export async function getActivities(): Promise<Activity[]> {
  return apiClient.get('/activities')
}

export async function getActivity(id: number): Promise<Activity | null> {
  return apiClient.get(`/activities/${id}`)
}

export async function createActivity(data: Partial<Activity>) {
  return apiClient.post('/activities', data)
}

export async function updateActivity(id: number, data: Partial<Activity>) {
  return apiClient.patch(`/activities/${id}`, data)
}
