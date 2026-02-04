import { apiFetch } from './api-client'
import { buildUrlWithParams } from './utils'

// Types
export type ReportTimePeriod = 'thirty_days' | 'one_week' | 'one_day'

export type ReportMetric = 'sync_run_triggered' | 'total_sync_run_rows' | 'all'

export type ReportDataPoint = {
  time_slice: string
  total_count: number
  failed_count: number
  success_count: number
}

export type Report = {
  data: {
    sync_run_triggered: ReportDataPoint[]
    total_sync_run_rows: ReportDataPoint[]
  }
}

export type ReportOptions = {
  metric?: ReportMetric
  timePeriod?: ReportTimePeriod
  connectorIds?: number[]
}

// API Functions

/**
 * Get workspace activity report
 * Returns metrics on sync runs and rows synced over time
 */
export async function getReport({
  metric = 'all',
  timePeriod = 'one_week',
  connectorIds = [],
}: ReportOptions = {}): Promise<Report> {
  return apiFetch<null, Report>({
    method: 'get',
    url: buildUrlWithParams('/reports', {
      type: 'workspace_activity',
      metric,
      time_period: timePeriod,
      connector_ids: connectorIds.length > 0 ? connectorIds : undefined,
    }),
  })
}
