import { apiFetch } from './api-client'
import type { ApiResponse } from './common'
import { buildUrlWithParams } from './utils'

// Model type constants
export const AllDataModels =
  'raw_sql,dbt,soql,table_selector,dynamic_sql,unstructured,vector_search,semistructured'
export const AllDataModelsWithoutDynamicSQL =
  'raw_sql,dbt,soql,table_selector,unstructured,semistructured'

// Types
export type Field = Record<string, string | number | boolean | null>

export type ModelAttributes = {
  id: string
  name: string
  description: string
  query: string
  query_type: string
  primary_key: string
  icon: string
  created_at: string
  updated_at: string
  connector: {
    id: string
    name: string
    icon: string
  }
}

export type Model = {
  id: string
  type: string
  attributes: ModelAttributes
}

export type GetAllModelsProps = {
  type?: string
  page?: number
  perPage?: number
}

export type QuerySourcePayload = {
  query: string
}

export type QuerySourceResponse = {
  success: boolean
  data?: Field[]
}

// API Functions

/**
 * Execute a SQL query against a connector (Query Source API)
 * This is the primary method for fetching data for dashboards
 */
export async function querySource(
  connectorId: string,
  query: string,
): Promise<ApiResponse<Field[]>> {
  return apiFetch<QuerySourcePayload, ApiResponse<Field[]>>({
    method: 'post',
    url: `/connectors/${connectorId}/query_source`,
    data: { query },
  })
}

/**
 * Get all models with pagination and filtering
 */
export async function getAllModels({
  type = AllDataModels,
  page = 1,
  perPage = 10,
}: GetAllModelsProps = {}): Promise<ApiResponse<Model[]>> {
  return apiFetch<null, ApiResponse<Model[]>>({
    method: 'get',
    url: buildUrlWithParams('/models', {
      page,
      per_page: perPage,
      query_type: type,
    }),
  })
}

/**
 * Get a specific model by ID
 */
export async function getModelById(id: string): Promise<ApiResponse<Model>> {
  return apiFetch<null, ApiResponse<Model>>({
    method: 'get',
    url: `/models/${id}`,
  })
}

/**
 * Execute a model's query and return the results
 * Convenience method that fetches the model and executes its query
 */
export async function executeModel(
  modelId: string,
): Promise<ApiResponse<Field[]>> {
  const modelResponse = await getModelById(modelId)

  if (!modelResponse.data) {
    return {
      status: 404,
      errors: [{ status: 404, title: 'Not Found', detail: 'Model not found' }],
    }
  }

  const { query, connector } = modelResponse.data.attributes
  return querySource(connector.id, query)
}
