import { apiClient } from './client'
import type { Notice } from '../types'

export async function getNotices(): Promise<Notice[]> {
  return apiClient.get('/notices')
}

export async function getNotice(id: number): Promise<Notice | null> {
  return apiClient.get(`/notices/${id}`)
}

export async function createNotice(data: Partial<Notice>) {
  return apiClient.post('/notices', data)
}

export async function deleteNotice(id: number) {
  return apiClient.delete(`/notices/${id}`)
}
