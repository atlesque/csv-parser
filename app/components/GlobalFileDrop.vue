<template>
  <!-- Drop overlay: shown while a file is dragged anywhere over the page -->
  <div
    v-if="isDragging || showProgress"
    class="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-6"
  >
    <div
      class="flex w-full max-w-lg flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800/50 p-10"
    >
      <template v-if="isDragging">
        <svg class="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
          {{ csvStore.hasData ? 'Drop to replace the current file' : 'Drop to upload' }}
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500">CSV files only</p>
      </template>

      <template v-else>
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ csvStore.file?.name }}</p>
        <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-full rounded-full bg-gray-900 dark:bg-gray-100"
            :style="{ width: csvStore.loadingProgress + '%' }"
          />
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500">Parsing&hellip; {{ csvStore.loadingProgress }}%</p>
      </template>
    </div>
  </div>

  <!-- Parse error for a file dropped outside the upload page -->
  <div
    v-if="dropError"
    class="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-400 shadow-lg"
    role="alert"
  >
    <p class="flex-1">Could not load {{ dropError.fileName }}: {{ dropError.message }}</p>
    <button
      class="shrink-0 cursor-pointer font-medium hover:underline"
      aria-label="Dismiss"
      @click="dropError = null"
    >
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCsvStore } from '~/stores/csv'

const csvStore = useCsvStore()
const route = useRoute()

const isDragging = ref(false)
const dropError = ref<{ fileName: string; message: string } | null>(null)
// dragenter/dragleave fire for every child element crossed, so track depth
// to know when the drag has actually left the window.
let dragDepth = 0

// The upload page shows its own progress and errors in the drop zone.
const isUploadPage = computed(() => route.path === '/')
const showProgress = computed(() => csvStore.isParsing && !isUploadPage.value)

function hasFiles(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files')
}

function onDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth++
  isDragging.value = true
}

function onDragOver(event: DragEvent) {
  if (!hasFiles(event)) return
  // Required for the browser to allow dropping instead of opening the file.
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

function onDragLeave(event: DragEvent) {
  if (!hasFiles(event)) return
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDragging.value = false
}

async function onDrop(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  isDragging.value = false

  const droppedFile = event.dataTransfer?.files?.[0]
  if (!droppedFile || csvStore.isParsing) return

  dropError.value = null
  csvStore.setFile(droppedFile)
  await csvStore.parseFile()

  if (csvStore.parseError) {
    if (!isUploadPage.value) {
      dropError.value = { fileName: droppedFile.name, message: csvStore.parseError }
    }
    return
  }
  if (route.path !== '/results') {
    await navigateTo('/results')
  }
}

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('drop', onDrop)
})

onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('drop', onDrop)
})
</script>
