<template>
  <div v-if="table" class="relative" @click.stop>
    <button
      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      @click="toggle"
    >
      Columns
      <span aria-hidden="true" class="text-gray-400">&dtrif;</span>
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 shadow-lg"
    >
      <label
        v-for="column in table.getAllLeafColumns()"
        :key="column.id"
        class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <input
          type="checkbox"
          :checked="column.getIsVisible()"
          class="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-gray-900 dark:focus:ring-gray-100"
          @change="column.toggleVisibility()"
        />
        {{ column.id }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table';
import { onMounted, onUnmounted, ref } from 'vue';

defineProps<{
  table?: Table<Record<string, unknown>>
}>()

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function onWindowClick() {
  open.value = false
}

onMounted(() => window.addEventListener('click', onWindowClick))
onUnmounted(() => window.removeEventListener('click', onWindowClick))
</script>
