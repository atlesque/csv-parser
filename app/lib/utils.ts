import Papa from 'papaparse'
import type { CsvRow } from '~/types/csv'

const NUMBER_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/

/**
 * Convert raw CSV text into a typed value for formatted display and sorting.
 * Values that would not survive the round trip (leading zeros, integers past
 * the safe range) stay as text.
 */
export function parseTypedValue(raw: unknown): string | number | boolean | null {
  if (raw === null || raw === undefined || raw === '') {
    return null
  }
  if (typeof raw !== 'string') {
    return raw as number | boolean
  }
  if (raw === 'true' || raw === 'TRUE') return true
  if (raw === 'false' || raw === 'FALSE') return false
  if (NUMBER_PATTERN.test(raw)) {
    const num = Number(raw)
    if (Number.isFinite(num) && (!Number.isInteger(num) || Number.isSafeInteger(num))) {
      return num
    }
  }
  return raw
}

export function formatCellValue(value: unknown, plainText = false): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (plainText) {
    return String(value)
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
