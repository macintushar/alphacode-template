import { apiFetch } from './api-client'
import type { ApiResponse } from './common'
import { buildUrlWithParams } from './utils'

// Types
export type CatalogStream = {
  name: string
  json_schema: {
    type: string
    properties: Record<
      string,
      {
        type: string | string[]
      }
    >
  }
  supported_sync_modes: string[]
}

export type Catalog = {
  streams: CatalogStream[]
}

export type DiscoverResponse = {
  data: {
    id: string
    type: string
    attributes: {
      catalog: Catalog
      connector_id: number
    }
  }
}

export type SyncRunStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'failed'
  | 'canceled'

export type SyncAttributes = {
  name: string
  status: string
  source_id: number
  destination_id: number
  schedule_type: string
  sync_interval: number
  sync_interval_unit: string
  stream_name: string
  sync_mode: string
  cursor_field: string | null
  created_at: string
  updated_at: string
}

export type Sync = {
  id: string
  type: string
  attributes: SyncAttributes
}

export type SyncRun = {
  id: string
  type: string
  attributes: {
    sync_id: number
    status: SyncRunStatus
    total_rows: number
    successful_rows: number
    failed_rows: number
    started_at: string
    finished_at: string | null
    duration: number | null
    error_message: string | null
    created_at: string
    updated_at: string
  }
}

// API Functions

/**
 * Discover the schema (catalog) of a connector
 * Returns available tables/streams and their columns
 */
export async function getCatalog(
  connectorId: string,
  refresh = false,
): Promise<ApiResponse<DiscoverResponse>> {
  return apiFetch<null, ApiResponse<DiscoverResponse>>({
    method: 'get',
    url: `/connectors/${connectorId}/discover?refresh=${refresh}`,
  })
}

/**
 * Get all syncs with pagination
 */
export async function fetchSyncs(
  page = 1,
  perPage = 10,
): Promise<ApiResponse<Sync[]>> {
  return apiFetch<null, ApiResponse<Sync[]>>({
    method: 'get',
    url: buildUrlWithParams('/syncs', { page, per_page: perPage }),
  })
}

/**
 * Get a specific sync by ID
 */
export async function getSyncById(id: string): Promise<ApiResponse<Sync>> {
  return apiFetch<null, ApiResponse<Sync>>({
    method: 'get',
    url: `/syncs/${id}`,
  })
}

/**
 * Get sync runs for a specific sync
 */
export async function getSyncRunsBySyncId(
  syncId: string,
  page = 1,
  perPage = 10,
): Promise<ApiResponse<SyncRun[]>> {
  return apiFetch<null, ApiResponse<SyncRun[]>>({
    method: 'get',
    url: buildUrlWithParams(`/syncs/${syncId}/sync_runs`, {
      page,
      per_page: perPage,
    }),
  })
}

/**
 * Get a specific sync run
 */
export async function getSyncRunById(
  syncId: string,
  syncRunId: string,
): Promise<ApiResponse<SyncRun>> {
  return apiFetch<null, ApiResponse<SyncRun>>({
    method: 'get',
    url: `/syncs/${syncId}/sync_runs/${syncRunId}`,
  })
}
