<template>
  <button
    class="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    :disabled="!hasRows"
    @click="exportData"
  >
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    Export CSV
  </button>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { computed } from 'vue';
import { downloadCsv } from '~/lib/utils';
import type { CsvRow } from '~/types/csv';

const props = defineProps<{
  table?: Table<Record<string, unknown>>
}>()

const hasRows = computed(() => {
  if (!props.table) return false
  return props.table.getFilteredRowModel().rows.length > 0
})

function exportData() {
  if (!props.table) return
  const rows = props.table.getFilteredRowModel().rows.map((row) => row.original as CsvRow)
  const visibleColumns = props.table.getVisibleLeafColumns().map((col) => col.id)
  downloadCsv(rows, visibleColumns, 'export.csv')
}
</script>
