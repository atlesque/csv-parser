<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="flex h-14 items-center justify-between px-4">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          CSV Parser
        </NuxtLink>
        <div class="flex items-center gap-2">
          <ClientOnly>
            <DarkModeToggle />
          </ClientOnly>
        </div>
      </div>
    </header>
    <main class="px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
