<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          CSV Parser
        </NuxtLink>
        <div class="flex items-center gap-2">
          <ClientOnly>
            <DarkModeToggle />
          </ClientOnly>
          <button
            v-if="isResultsPage"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="startOver"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            Start Over
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCsvStore } from '~/stores/csv'

const route = useRoute()
const csvStore = useCsvStore()

const isResultsPage = computed(() => route.path === '/results')

function startOver() {
  csvStore.clearData()
  navigateTo('/')
}
</script>
