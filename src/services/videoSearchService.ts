import apiClient from './api'
import type { SearchResponse, ProcessVideoResponse } from '../types'

export const videoSearchService = {
  async search(query: string, limit = 5, offset = 0, videoName?: string): Promise<SearchResponse> {
    const params: Record<string, any> = { q: query, limit, offset }
    if (videoName) params.video_name = videoName
    const response = await apiClient.get<SearchResponse>('/search', { params })
    return response.data
  },

  async processVideo(videoPath: string): Promise<ProcessVideoResponse> {
    const response = await apiClient.post<ProcessVideoResponse>('/process-video', {
      video_path: videoPath,
    })
    return response.data
  },

  async exportDataset(data: { video_name: string; frame_id: string; label: string }): Promise<{ status: string; label: string; saved_path: string }> {
    const response = await apiClient.post('/dataset/export', data)
    return response.data
  },

  async checkHealth(): Promise<{ status: string }> {
    const response = await apiClient.get('/health')
    return response.data
  },
}
