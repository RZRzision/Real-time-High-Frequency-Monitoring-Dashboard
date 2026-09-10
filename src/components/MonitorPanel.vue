<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <section
    class="rounded-lg border border-slate-800 bg-slate-900"
  >
    <header
      class="flex items-center justify-between border-b border-slate-800 px-5 py-4"
    >
      <div>
        <h2 class="text-sm font-medium text-slate-200">
          {{ title }}
        </h2>

        <p
          v-if="description"
          class="mt-1 text-xs text-slate-500"
        >
          {{ description }}
        </p>
      </div>

      <div
        class="h-2 w-2 rounded-full bg-emerald-400"
        aria-label="Panel active"
      />
    </header>

    <div class="p-5">
      <slot />
    </div>
  </section>
</template>