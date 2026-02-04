import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { env } from '@/env'

const API_VERSION = '/api/v1'

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: `${env.VITE_API_HOST}${API_VERSION}`,
  })

  instance.interceptors.request.use(
    (config) => {
      config.headers['Workspace-Id'] = env.VITE_WORKSPACE_ID
      config.headers['Authorization'] = `Bearer ${env.VITE_API_TOKEN}`
      config.headers['Accept'] = '*/*'
      config.headers['Content-Type'] = 'application/json'
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Return the error response for handling by the caller
      if (error.response) {
        return error.response
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export const apiClient = createApiClient()

export type FetchProps<PayloadType> = {
  url: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  data?: PayloadType
  options?: AxiosRequestConfig
}

export async function apiFetch<PayloadType, ResponseType>({
  url,
  method,
  data,
  options,
}: FetchProps<PayloadType>): Promise<ResponseType> {
  const config = { ...options }

  switch (method) {
    case 'post':
      return apiClient.post(url, data, config).then((res) => res.data)
    case 'put':
      return apiClient.put(url, data, config).then((res) => res.data)
    case 'delete':
      return apiClient.delete(url, config).then((res) => res.data)
    case 'patch':
      return apiClient.patch(url, data, config).then((res) => res.data)
    default:
      return apiClient.get(url, config).then((res) => res.data)
  }
}
