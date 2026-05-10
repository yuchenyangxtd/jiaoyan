import { apiClient } from './client'
import type { UserProfile } from '../types'

export async function getUsers(): Promise<UserProfile[]> {
  return apiClient.get('/users')
}
