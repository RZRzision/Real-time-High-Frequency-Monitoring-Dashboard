<script setup lang="ts">
import type { PerformanceMetrics } from '../types/performance'

defineProps<{
  metrics: PerformanceMetrics
}>()
</script>

<template>
  <section
    class="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
  >
    <div class="mb-4 flex items-center justify-between">
      <div>
        <p
          class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500"
        >
          Performance
        </p>

        <h2 class="mt-1 text-lg font-semibold text-slate-100">
          Runtime Metrics
        </h2>
      </div>

      <div
        class="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
      >
        LIVE
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        class="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
      >
        <p class="text-xs text-slate-500">
          Data Rate
        </p>

        <p class="mt-2 text-2xl font-semibold text-slate-100">
          {{ metrics.dataRate.toLocaleString() }}
        </p>

        <p class="mt-1 text-xs text-slate-500">
          events / sec
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
      >
        <p class="text-xs text-slate-500">
          Render FPS
        </p>

        <p class="mt-2 text-2xl font-semibold text-slate-100">
          {{ metrics.renderFps }}
        </p>

        <p class="mt-1 text-xs text-slate-500">
          frames / sec
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
      >
        <p class="text-xs text-slate-500">
          Buffer Size
        </p>

        <p class="mt-2 text-2xl font-semibold text-slate-100">
          {{ metrics.bufferSize.toLocaleString() }}
        </p>

        <p class="mt-1 text-xs text-slate-500">
          market ticks
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
      >
        <p class="text-xs text-slate-500">
          Rendered Points
        </p>

        <p class="mt-2 text-2xl font-semibold text-slate-100">
          {{ metrics.chartPoints }}
        </p>

        <p class="mt-1 text-xs text-slate-500">
          points after downsampling
        </p>
      </div>
    </div>
  </section>
</template>