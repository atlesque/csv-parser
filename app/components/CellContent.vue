<template>
  <span>
    <template v-for="(segment, index) in segments" :key="`${index}-${segment.text}`">
      <a
        v-if="segment.href"
        :href="segment.href"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-600 dark:hover:text-blue-300"
        @click.stop
      >
        <HighlightText :text="segment.text" :query="searchQuery" />
      </a>
      <HighlightText v-else :text="segment.text" :query="searchQuery" />
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HighlightText from '~/components/HighlightText.vue'
import { linkifyText } from '~/lib/links'

const props = defineProps<{
  text: string
  query?: string
}>()

const segments = computed(() => linkifyText(props.text))
const searchQuery = computed(() => props.query ?? '')
</script>
