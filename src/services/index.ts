// API Client
export { apiClient, apiFetch } from './api-client'
export type { FetchProps } from './api-client'

// Common Types
export type {
  ApiResponse,
  ErrorResponse,
  LinksType,
  APIRequestMethod,
} from './common'

// Utils
export { buildUrlWithParams } from './utils'

// Connectors
export {
  getUserConnectors,
  getAllConnectors,
  getConnectorInfo,
  deleteConnector,
} from './connectors'
export type {
  Connector,
  ConnectorListResponse,
  ConnectorInfoResponse,
} from './connectors'

// Models & Query Source
export {
  querySource,
  getAllModels,
  getModelById,
  executeModel,
  AllDataModels,
  AllDataModelsWithoutDynamicSQL,
} from './models'
export type { Model, ModelAttributes, Field, GetAllModelsProps } from './models'

// Syncs & Catalog Discovery
export {
  getCatalog,
  fetchSyncs,
  getSyncById,
  getSyncRunsBySyncId,
  getSyncRunById,
} from './syncs'
export type {
  Sync,
  SyncRun,
  Catalog,
  CatalogStream,
  DiscoverResponse,
} from './syncs'

// Dashboard & Reports
export { getReport } from './dashboard'
export type {
  Report,
  ReportDataPoint,
  ReportOptions,
  ReportTimePeriod,
  ReportMetric,
} from './dashboard'
