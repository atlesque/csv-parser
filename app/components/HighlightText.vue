<template>
  <span v-if="!query || !text">{{ text }}</span>
  <span v-else v-html="html"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string
  query: string
}>()

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const html = computed(() => {
  const escapedText = escapeHtml(props.text)
  const escapedQuery = escapeHtml(props.query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return escapedText.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5 text-gray-900 dark:text-yellow-100">$1</mark>',
  )
})
</script>
