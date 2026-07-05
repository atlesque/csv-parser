<template>
  <div v-if="table" class="relative">
    <button
      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      @click="open = !open"
      @blur="onCloseDelay"
    >
      Columns
      <span aria-hidden="true" class="text-gray-400">&dtrif;</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
    >
      <label
        v-for="column in table.getAllLeafColumns()"
        :key="column.id"
        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
      >
        <input
          type="checkbox"
          :checked="column.getIsVisible()"
          class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          @change="column.toggleVisibility()"
        />
        {{ column.columnDef.header as string }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { ref } from 'vue'

defineProps<{
  table?: Table<Record<string, unknown>>
}>()

const open = ref(false)

function onCloseDelay() {
  setTimeout(() => {
    open.value = false
  }, 150)
}
</script>
