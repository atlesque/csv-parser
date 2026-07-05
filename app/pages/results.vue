<template>
  <div>
    <div v-if="!csvStore.hasData" class="flex flex-col items-center gap-4 py-20">
      <p class="text-gray-500 dark:text-gray-400">No data to display.</p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-gray-100 dark:text-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        &larr; Upload a CSV file
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            @click="startOver"
          >
            &larr; Start over
          </button>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ csvStore.rowCount.toLocaleString() }} rows &middot;
            {{ csvStore.columnCount }} columns
          </p>
        </div>
        <div class="flex items-center gap-2">
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

async function startOver() {
  csvStore.clearData()
  await navigateTo('/')
}
</script>
