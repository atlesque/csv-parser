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
      worker: true,

      step: (results, _parser) => {
        allRows.push(results.data as CsvRow)
        if (callbacks.onProgress && file.size) {
          callbacks.onProgress({
            loaded: allRows.length,
            total: 0, // unknown until complete
          })
        }
      },

      complete: (results) => {
        const columns = results.meta.fields ?? []
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
