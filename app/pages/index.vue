<template>
  <div class="flex flex-col items-center justify-center gap-6 py-12">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">CSV Parser</h1>
    <p class="text-gray-500 dark:text-gray-400">Upload a CSV file to view, sort, filter, and export your data.</p>

    <FileDropZone @parsed="onParsed" />
  </div>
</template>

<script setup lang="ts">
import FileDropZone from '~/components/FileDropZone.vue';
import { useCsvStore } from '~/stores/csv';

const csvStore = useCsvStore()

async function onParsed() {
  await navigateTo('/results')
}
</script>
