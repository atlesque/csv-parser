<template>
  <span>
    <template v-for="(part, index) in parts" :key="`${index}-${part.text}`">
      <mark
        v-if="part.highlight"
        class="bg-yellow-200 dark:bg-yellow-800 rounded-sm px-0.5 text-gray-900 dark:text-yellow-100"
      >{{ part.text }}</mark>
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  query: string
}>()

interface TextPart {
  text: string
  highlight: boolean
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const parts = computed<TextPart[]>(() => {
  if (!props.query || !props.text) {
    return [{ text: props.text, highlight: false }]
  }

  const regex = new RegExp(escapeRegExp(props.query), 'gi')
  const result: TextPart[] = []
  let lastIndex = 0

  for (const match of props.text.matchAll(regex)) {
    const matchIndex = match.index ?? 0
    if (matchIndex > lastIndex) {
      result.push({ text: props.text.slice(lastIndex, matchIndex), highlight: false })
    }
    result.push({ text: match[0], highlight: true })
    lastIndex = matchIndex + match[0].length
  }

  if (lastIndex < props.text.length) {
    result.push({ text: props.text.slice(lastIndex), highlight: false })
  }

  return result.length > 0 ? result : [{ text: props.text, highlight: false }]
})
</script>
