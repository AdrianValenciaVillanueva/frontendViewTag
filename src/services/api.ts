import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar API Key si existe en el localStorage
apiClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('viewtag_api_key')
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey
  }
  return config
})

export default apiClient
