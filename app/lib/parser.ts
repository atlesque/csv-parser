import Papa from 'papaparse'
import type { CsvRow, ParseProgress, ParseResult } from '~/types/csv'

interface ParseCallbacks {
  onProgress?: (progress: ParseProgress) => void
}

/**
 * Read a file as text, returning the string content.
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Split CSV text into individual rows, respecting quoted fields that may
 * contain embedded newlines.
 */
function splitCsvRows(text: string): string[] {
  const rows: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (ch === '"') {
      if (inQuotes && next === '"') {
        // Escaped quote inside quotes
        current += '""'
        i++ // skip the next quote
      } else {
        inQuotes = !inQuotes
      }
      current += ch
    } else if (ch === '\n' && !inQuotes) {
      rows.push(current)
      current = ''
    } else {
      current += ch
    }
  }

  // Push the last row if there's any remaining content
  if (current.length > 0) {
    rows.push(current)
  }

  return rows
}

const CHUNK_SIZE = 500

export async function parseCsvFile(file: File, callbacks: ParseCallbacks = {}): Promise<ParseResult> {
  const text = await readFileAsText(file)

  // Split into rows, respecting quoted fields
  const allRows = splitCsvRows(text)
  if (allRows.length === 0) {
    return { data: [], columns: [] }
  }

  const header = allRows[0]
  const dataRows = allRows.slice(1)
  const estimatedTotal = dataRows.length

  const parsedRows: CsvRow[] = []

  for (let i = 0; i < dataRows.length; i += CHUNK_SIZE) {
    const chunk = [header, ...dataRows.slice(i, i + CHUNK_SIZE)].join('\n')

    await new Promise<void>((resolve, reject) => {
      Papa.parse<CsvRow>(chunk, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          parsedRows.push(...results.data)
          if (callbacks.onProgress) {
            callbacks.onProgress({
              loaded: parsedRows.length,
              total: estimatedTotal,
            })
          }
          resolve()
        },
        error: (error: Error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`))
        },
      })
    })

    // Yield to the event loop so Vue can re-render the progress bar
    await new Promise((r) => setTimeout(r, 0))
  }

  const columns = parsedRows.length > 0 ? Object.keys(parsedRows[0]) : []
  return { data: parsedRows, columns }
}
