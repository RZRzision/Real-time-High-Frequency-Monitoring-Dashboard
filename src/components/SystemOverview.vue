<script setup lang="ts">
import type { SystemMetric } from '../types/monitor'

interface Props {
  metric: SystemMetric | null
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-5">
    <div>
      <div class="mb-2 flex justify-between text-sm">
        <span class="text-slate-400">CPU</span>
        <span class="text-slate-200">
          {{ metric?.cpu.toFixed(1) ?? '--' }}%
        </span>
      </div>

      <div class="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          class="h-full rounded-full bg-emerald-400 transition-all"
          :style="{ width: `${metric?.cpu ?? 0}%` }"
        />
      </div>
    </div>

    <div>
      <div class="mb-2 flex justify-between text-sm">
        <span class="text-slate-400">Memory</span>
        <span class="text-slate-200">
          {{ metric?.memory.toFixed(1) ?? '--' }}%
        </span>
      </div>

      <div class="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          class="h-full rounded-full bg-blue-400 transition-all"
          :style="{ width: `${metric?.memory ?? 0}%` }"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <p class="text-xs text-slate-500">
          Network In
        </p>

        <p class="mt-1 text-lg font-medium text-slate-200">
          {{ metric?.networkIn.toFixed(1) ?? '--' }}
          <span class="text-xs text-slate-500">MB/s</span>
        </p>
      </div>

      <div>
        <p class="text-xs text-slate-500">
          Network Out
        </p>

        <p class="mt-1 text-lg font-medium text-slate-200">
          {{ metric?.networkOut.toFixed(1) ?? '--' }}
          <span class="text-xs text-slate-500">MB/s</span>
        </p>
      </div>
    </div>
  </div>
</template>