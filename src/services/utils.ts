/**
 * Build a URL with query parameters
 */
export function buildUrlWithParams(
  url: string,
  params: Record<
    string,
    string | number | boolean | undefined | null | Array<string | number>
  >,
): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      // Handle arrays with brackets notation: key[]=value1&key[]=value2
      for (const item of value) {
        searchParams.append(`${key}[]`, String(item))
      }
    } else {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  return queryString ? `${url}?${queryString}` : url
}
