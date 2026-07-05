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
        class="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 select-none"
      >
        <span class="relative flex size-4 shrink-0 items-center justify-center">
          <input
            type="checkbox"
            :checked="column.getIsVisible()"
            class="peer sr-only"
            @change="column.toggleVisibility()"
          />
          <span
            class="absolute inset-0 rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 transition-all duration-150
                   peer-checked:border-gray-900 peer-checked:bg-gray-900 dark:peer-checked:border-gray-100 dark:peer-checked:bg-gray-100
                   peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900/30 dark:peer-focus-visible:ring-gray-100/30 peer-focus-visible:ring-offset-1
                   group-hover:border-gray-400 dark:group-hover:border-gray-400"
          />
          <svg
            class="pointer-events-none relative size-3 text-white dark:text-gray-900 opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 8l3.5 3.5L13 5" />
          </svg>
        </span>
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
