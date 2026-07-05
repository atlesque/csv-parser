<template>
  <div>
    <div v-if="!csvStore.hasData" class="flex flex-col items-center gap-4 py-20">
      <p class="text-gray-500">No data to display.</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        &larr; Upload a CSV file
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-gray-500">
          {{ csvStore.rowCount.toLocaleString() }} rows &middot;
          {{ csvStore.columnCount }} columns
        </p>
        <div class="flex items-center gap-2">
          <input
            ref="uploadInput"
            type="file"
            accept=".csv,text/csv"
            class="hidden"
            @change="onUploadNewCsv"
          />
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="openUploadDialog"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload New CSV
          </button>
          <ColumnSelector :table="table" />
          <ExportButton :table="table" />
        </div>
      </div>

      <CsvTable ref="tableRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { ref } from 'vue'
import ColumnSelector from '~/components/ColumnSelector.vue'
import type CsvTable from '~/components/CsvTable.vue'
import ExportButton from '~/components/ExportButton.vue'
import { useCsvStore } from '~/stores/csv'

definePageMeta({
  ssr: false,
})

const csvStore = useCsvStore()
const tableRef = ref<InstanceType<typeof CsvTable> | null>(null)
const table = computed(() => tableRef.value?.table as Table<Record<string, unknown>> | undefined)
const uploadInput = ref<HTMLInputElement | null>(null)

function openUploadDialog() {
  uploadInput.value?.click()
}

async function onUploadNewCsv(event: Event) {
  const input = event.target as HTMLInputElement
  const selectedFile = input.files?.[0]
  if (!selectedFile) return

  csvStore.setFile(selectedFile)
  await csvStore.parseFile()

  // Reset the input so the same file can be re-selected if needed
  input.value = ''
}
</script>
