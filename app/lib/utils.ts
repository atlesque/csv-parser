import Papa from 'papaparse'
import type { CsvRow } from '~/types/csv'

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return String(value)
}

export function downloadCsv(data: CsvRow[], columns: string[], filename = 'export.csv'): void {
  const csv = Papa.unparse({
    fields: columns,
    data: data.map((row) => columns.map((col) => row[col] ?? '')),
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
