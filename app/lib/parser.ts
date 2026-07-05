import Papa from 'papaparse'
import type { CsvRow, ParseProgress, ParseResult } from '~/types/csv'

interface ParseCallbacks {
  onProgress?: (progress: ParseProgress) => void
}

export function parseCsvFile(file: File, callbacks: ParseCallbacks = {}): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const allRows: CsvRow[] = []

    Papa.parse<CsvRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,

      step: (results, _parser) => {
        allRows.push(results.data as CsvRow)
        if (callbacks.onProgress && file.size) {
          callbacks.onProgress({
            loaded: allRows.length,
            total: 0, // unknown until complete
          })
        }
      },

      complete: (_results) => {
        const columns = allRows.length > 0 ? Object.keys(allRows[0]) : []
        resolve({
          data: allRows,
          columns,
        })
      },

      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`))
      },
    })
  })
}
