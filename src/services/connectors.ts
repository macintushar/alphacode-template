import { apiFetch } from './api-client'
import type { ApiResponse } from './common'
import { buildUrlWithParams } from './utils'

// Types
export type ConnectorConfiguration = Record<string, unknown>

export type Connector = {
  id: string
  type: string
  attributes: {
    name: string
    icon: string
    connector_type: 'source' | 'destination'
    connector_category: string
    description: string
    configuration: ConnectorConfiguration
    created_at: string
    updated_at: string
  }
}

export type ConnectorListResponse = {
  data: Connector[]
  links?: {
    first: string
    last: string
    next: string | null
    prev: string | null
    self: string
  }
}

export type ConnectorInfoResponse = {
  data: Connector
}

// API Functions

/**
 * Get all connectors for the workspace
 */
export async function getUserConnectors(
  connectorType: 'source' | 'destination',
  page = 1,
  perPage = 10,
): Promise<ConnectorListResponse> {
  return apiFetch<null, ConnectorListResponse>({
    method: 'get',
    url: buildUrlWithParams('/connectors', {
      type: connectorType,
      page,
      per_page: perPage,
    }),
  })
}

/**
 * Get all connectors without filters
 */
export async function getAllConnectors(): Promise<ConnectorListResponse> {
  return apiFetch<null, ConnectorListResponse>({
    method: 'get',
    url: '/connectors',
  })
}

/**
 * Get a specific connector by ID
 */
export async function getConnectorInfo(
  id: string,
): Promise<ConnectorInfoResponse> {
  return apiFetch<null, ConnectorInfoResponse>({
    method: 'get',
    url: `/connectors/${id}`,
  })
}

/**
 * Delete a connector
 */
export async function deleteConnector(
  id: string,
): Promise<ApiResponse<ConnectorInfoResponse>> {
  return apiFetch<null, ApiResponse<ConnectorInfoResponse>>({
    method: 'delete',
    url: `/connectors/${id}`,
  })
}
