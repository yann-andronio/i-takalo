export function SearchUtils<T>(data: T[], search: string, keys: (keyof T)[]): T[] {
  const transformValuesearch = search.toLowerCase()

  return data.filter((item) =>
    keys.some((key) => {
      const value = item[key]
      return typeof value === 'string' && value.toLowerCase().includes(transformValuesearch)
    })
  )
}