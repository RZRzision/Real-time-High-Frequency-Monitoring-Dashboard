<script setup lang="ts">
import type { AlertEvent } from '../types/monitor'

interface Props {
  alerts: AlertEvent[]
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="alert in alerts"
      :key="alert.id"
      class="flex items-center justify-between rounded-md bg-slate-950 px-4 py-3"
    >
      <div>
        <span
          class="mr-3 text-xs font-medium uppercase"
          :class="{
            'text-blue-400': alert.level === 'info',
            'text-yellow-400': alert.level === 'warning',
            'text-red-400': alert.level === 'critical',
          }"
        >
          {{ alert.level }}
        </span>

        <span class="text-sm text-slate-300">
          {{ alert.message }}
        </span>
      </div>

      <time class="text-xs text-slate-600">
        {{ new Date(alert.timestamp).toLocaleTimeString() }}
      </time>
    </div>

    <p
      v-if="alerts.length === 0"
      class="py-6 text-center text-sm text-slate-600"
    >
      No active alerts
    </p>
  </div>
</template>