import { apiClient } from './client'
import type { Material } from '../types'

export async function getMaterials(submitterId?: string): Promise<Material[]> {
  const params = submitterId ? `?submitter_id=${submitterId}` : ''
  return apiClient.get(`/materials${params}`)
}

export async function getMaterial(id: number): Promise<Material | null> {
  return apiClient.get(`/materials/${id}`)
}

export async function submitMaterial(data: Partial<Material>) {
  return apiClient.post('/materials', data)
}

export async function reviewMaterial(id: number, data: { status: string; comment: string }) {
  return apiClient.patch(`/materials/${id}`, data)
}
