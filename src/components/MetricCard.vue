<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  unit?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="rounded-lg border border-slate-800 bg-slate-900 p-4"
  >
    <p class="text-sm text-slate-400">
      {{ label }}
    </p>

    <p class="mt-2 text-2xl font-semibold text-white">
      {{ value }}{{ unit ?? '' }}
    </p>
  </div>
</template>