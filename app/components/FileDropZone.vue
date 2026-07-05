<template>
  <ClientOnly>
    <div class="w-full max-w-lg">
      <div
        class="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-10 transition-colors"
        :class="{
          'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800/50': isDragActive,
          'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500': !isParsing,
        }"
        @dragover.prevent="isDragActive = true"
        @dragleave.prevent="isDragActive = false"
        @drop.prevent="onDrop"
        @click="openFileDialog"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv,text/csv"
          class="hidden"
          @change="onFileSelected"
        />

        <template v-if="!csvStore.file">
          <svg class="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-medium text-gray-900 dark:text-gray-100">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500">CSV files only</p>
        </template>

        <template v-else>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ csvStore.file.name }}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">{{ formatFileSize(csvStore.file.size) }}</p>
        </template>
      </div>

      <!-- Progress bar -->
      <div v-if="csvStore.loadingProgress > 0 && csvStore.loadingProgress < 100" class="mt-4 space-y-2">
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full rounded-full bg-gray-900 dark:bg-gray-100"
            :style="{ width: csvStore.loadingProgress + '%' }"
          />
        </div>
        <p class="text-center text-xs text-gray-400 dark:text-gray-500">Parsing&hellip; {{ csvStore.loadingProgress }}%</p>
      </div>

      <!-- Error -->
      <div v-if="csvStore.parseError" class="mt-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-400">
        {{ csvStore.parseError }}
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCsvStore } from '~/stores/csv';

const emit = defineEmits<{
  parsed: []
}>()

const csvStore = useCsvStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)
const isParsing = computed(() => csvStore.loadingProgress > 0 && csvStore.loadingProgress < 100)

function openFileDialog() {
  if (isParsing.value) return
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const selectedFile = input.files?.[0]
  if (selectedFile) {
    handleFile(selectedFile)
  }
}

function onDrop(event: DragEvent) {
  isDragActive.value = false
  const droppedFile = event.dataTransfer?.files?.[0]
  if (droppedFile) {
    handleFile(droppedFile)
  }
}

async function handleFile(selectedFile: File) {
  csvStore.setFile(selectedFile)
  await csvStore.parseFile()
  if (!csvStore.parseError) {
    emit('parsed')
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>
