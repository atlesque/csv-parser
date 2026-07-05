<template>
  <div class="flex flex-col items-center justify-center gap-6 py-12">
    <h1 class="text-2xl font-bold text-gray-900">CSV Parser</h1>
    <p class="text-gray-500">Upload a CSV file to view, sort, filter, and export your data.</p>

    <FileDropZone @parsed="onParsed" />

    <div v-if="csvStore.hasData && !csvStore.isParsing" class="flex flex-col items-center gap-3">
      <p class="text-sm text-gray-500">
        {{ csvStore.rowCount.toLocaleString() }} rows &middot;
        {{ csvStore.columnCount }} columns
      </p>
      <NuxtLink
        to="/results"
        class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        View Results
        <span aria-hidden="true">&rarr;</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileDropZone from '~/components/FileDropZone.vue';
import { useCsvStore } from '~/stores/csv';

const csvStore = useCsvStore()

function onParsed() {
  // Parsing completed — the reactive store already reflects this
}
</script>
