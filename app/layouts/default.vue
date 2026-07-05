<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-gray-900">
          CSV Parser
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
