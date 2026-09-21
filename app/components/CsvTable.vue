<template>
  <div class="space-y-4">
    <!-- Search -->
    <div class="flex flex-wrap items-center gap-3">
      <input
        v-model="globalFilter"
        type="text"
        placeholder="Search all columns..."
        class="min-w-48 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-gray-100"
      />

      <div
        class="inline-flex shrink-0 rounded-lg border border-gray-300 p-0.5 dark:border-gray-600"
        role="group"
        aria-label="View mode"
      >
        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-sm transition-colors"
          :class="viewMode === 'table'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'"
          :aria-pressed="viewMode === 'table'"
          @click="viewMode = 'table'"
        >
          Table
        </button>
        <button
          type="button"
          class="rounded-md px-3 py-1.5 text-sm transition-colors"
          :class="viewMode === 'cards'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'"
          :aria-pressed="viewMode === 'cards'"
          @click="viewMode = 'cards'"
        >
          Cards
        </button>
      </div>
    </div>

    <!-- Table -->
    <div v-if="viewMode === 'table'" class="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table class="w-full text-sm">
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="border-b border-gray-200 dark:border-gray-800"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="select-none px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
              :class="{ 'cursor-pointer hover:text-gray-900 dark:hover:text-gray-100': header.column.getCanSort() }"
              @click="header.column.getCanSort() && header.column.toggleSorting()"
            >
              <div class="flex items-center gap-1">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span v-if="header.column.getIsSorted() === 'asc'" class="text-gray-900 dark:text-gray-100">&uarr;</span>
                <span v-else-if="header.column.getIsSorted() === 'desc'" class="text-gray-900 dark:text-gray-100">&darr;</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="max-w-xs truncate whitespace-nowrap px-4 py-2.5 text-gray-700 dark:text-gray-300"
            >
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
          <tr v-if="table.getRowModel().rows.length === 0">
            <td
              :colspan="table.getAllLeafColumns().length"
              class="px-4 py-12 text-center text-gray-400 dark:text-gray-500"
            >
              No rows to display
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CsvCardView v-else :table="table" />

    <!-- Pagination -->
    <div v-if="table.getPageCount() > 1" class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <select
          :value="table.getState().pagination.pageSize"
          class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:border-gray-900 dark:focus:border-gray-100 focus:outline-none"
          @change="(e) => table.setPageSize(Number((e.target as HTMLSelectElement).value))"
        >
          <option v-for="size in pageSizes" :key="size" :value="size" class="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">{{ size }}</option>
        </select>
        <span class="text-sm text-gray-400 dark:text-gray-500">per page</span>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Prev
        </button>
        <span class="px-2 text-sm text-gray-500 dark:text-gray-400">
          {{ table.getState().pagination.pageIndex + 1 }} / {{ table.getPageCount() }}
        </span>
        <button
          class="rounded-lg px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, h, ref } from 'vue'
import CellContent from '~/components/CellContent.vue'
import CsvCardView from '~/components/CsvCardView.vue'
import { formatCellValue } from '~/lib/utils'
import { useCsvStore } from '~/stores/csv'
import type { CsvRow } from '~/types/csv'

const csvStore = useCsvStore()
const globalFilter = ref('')
const viewMode = ref<'table' | 'cards'>('table')
const pageSizes = [25, 50, 100, 250]

const columnHelper = createColumnHelper<CsvRow>()

const columnDefs = computed(() =>
  csvStore.columns.map((col) =>
    columnHelper.accessor(col, {
      header: () => col,
      cell: (info) => {
        const text = formatCellValue(info.getValue())
        return h(CellContent, { text, query: globalFilter.value })
      },
      enableSorting: true,
    }),
  ),
)

const data = computed(() => csvStore.rawData)

const table = useVueTable({
  get data() {
    return data.value
  },
  get columns() {
    return columnDefs.value
  },
  state: {
    get globalFilter() {
      return globalFilter.value
    },
  },
  onGlobalFilterChange: (value) => {
    globalFilter.value = value
  },
  globalFilterFn: 'includesString',
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: { pageSize: 50 },
  },
})

defineExpose({ table })
</script>
