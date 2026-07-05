export interface CsvRow {
  [key: string]: string | number | boolean | null
}

export interface ParseProgress {
  loaded: number
  total: number
}

export interface ColumnMeta {
  key: string
  label: string
}

export interface ParseResult {
  data: CsvRow[]
  columns: string[]
}

export type SortDirection = 'asc' | 'desc'
