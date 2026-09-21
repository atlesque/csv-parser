<template>
  <div
    v-if="table.getRowModel().rows.length > 0"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
  >
    <article
      v-for="row in table.getRowModel().rows"
      :key="row.id"
      class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <dl class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          class="py-3 first:pt-0 last:pb-0"
        >
          <dt class="min-w-0 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {{ cell.column.id }}
          </dt>
          <dd class="mt-1 min-w-0 break-words text-left text-sm text-gray-700 dark:text-gray-300">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </dd>
        </div>
      </dl>
    </article>
  </div>

  <div
    v-else
    class="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500"
  >
    No rows to display
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import type { CsvRow } from '~/types/csv'

defineProps<{
  table: Table<CsvRow>
}>()
</script>
