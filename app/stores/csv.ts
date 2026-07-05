import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { parseCsvFile } from '~/lib/parser'
import type { CsvRow } from '~/types/csv'

export const useCsvStore = defineStore('csv', () => {
  const file = ref<File | null>(null)
  const rawData = ref<CsvRow[]>([])
  const columns = ref<string[]>([])
  const loadingProgress = ref(0)
  const parseError = ref<string | null>(null)

  const hasData = computed(() => rawData.value.length > 0)
  const isParsing = computed(() => loadingProgress.value > 0 && loadingProgress.value < 100)
  const rowCount = computed(() => rawData.value.length)
  const columnCount = computed(() => columns.value.length)

  function setFile(newFile: File) {
    file.value = newFile
    parseError.value = null
    loadingProgress.value = 0
  }

  async function parseFile() {
    if (!file.value) return

    loadingProgress.value = 1
    parseError.value = null

    try {
      const result = await parseCsvFile(file.value, {
        onProgress: ({ loaded, total }: { loaded: number; total: number }) => {
          if (total > 0) {
            // Compute real progress based on actual rows parsed vs estimated total
            loadingProgress.value = Math.min(Math.round((loaded / total) * 100), 99)
          }
        },
      })

      rawData.value = result.data
      columns.value = result.columns
      loadingProgress.value = 100
    } catch (err) {
      parseError.value = err instanceof Error ? err.message : 'Unknown parsing error'
      loadingProgress.value = 0
    }
  }

  function clearData() {
    file.value = null
    rawData.value = []
    columns.value = []
    loadingProgress.value = 0
    parseError.value = null
  }

  return {
    file,
    rawData,
    columns,
    loadingProgress,
    parseError,
    hasData,
    isParsing,
    rowCount,
    columnCount,
    setFile,
    parseFile,
    clearData,
  }
})
