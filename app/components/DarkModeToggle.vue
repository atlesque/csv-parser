<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
    :title="title"
    @click="cycle"
  >
    <!-- Sun icon: currently light mode -->
    <svg
      v-if="mode === 'light'"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
    <!-- Moon icon: currently dark mode -->
    <svg
      v-else-if="mode === 'dark'"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
    <!-- Monitor icon: currently auto mode -->
    <svg
      v-else
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const { mode, cycle } = useDarkMode()

const titles: Record<string, string> = {
  light: 'Switch to dark mode',
  dark: 'Switch to auto mode',
  auto: 'Switch to light mode',
}

const title = computed(() => titles[mode.value] ?? 'Switch color mode')
</script>
