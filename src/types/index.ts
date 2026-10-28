export interface SearchResultItem {
  frame_id: string
  video_name: string
  timestamp_seconds: number
  score: number
}

export interface SearchResponse {
  results: SearchResultItem[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

export interface ProcessVideoRequest {
  video_path: string
}

export interface ProcessVideoResponse {
  video_name: string
  frames_processed: number
  embeddings_saved: number
}
