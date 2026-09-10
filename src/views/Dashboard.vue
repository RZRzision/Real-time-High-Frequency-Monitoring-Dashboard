<script setup lang="ts">
import { computed } from 'vue'

import AlertPanel from '../components/AlertPanel.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import MarketOverview from '../components/MarketOverview.vue'
import MetricCard from '../components/MetricCard.vue'
import MonitorPanel from '../components/MonitorPanel.vue'
import SystemOverview from '../components/SystemOverview.vue'
import { useMockMonitor } from '../composables/useMockMonitor'
import { usePerformanceMonitor } from '../composables/usePerformanceMonitor'
import PerformancePanel from '../components/PerformancePanel.vue'

const {
  marketTicks,
  chartTicks,
  systemMetric,
  alerts,
  receivedEventsTotal,
  setRate,
} = useMockMonitor()

const latestTick = computed(() => marketTicks.value.at(-1))
const { metrics } = usePerformanceMonitor(
  () => receivedEventsTotal.value,
  () => marketTicks.value.length,
  () => chartTicks.value.length,
)
</script>

<template>
  <main class="min-h-screen bg-slate-950 p-6 text-white">
    <div class="mx-auto max-w-[1600px]">
      <DashboardHeader />

      <section class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Latest Price"
          :value="latestTick?.price.toFixed(2) ?? '--'"
          unit=" USDT"
        />

        <MetricCard
          label="Market Change"
          :value="latestTick?.changePercent.toFixed(2) ?? '--'"
          unit="%"
        />

        <MetricCard
          label="CPU Usage"
          :value="systemMetric?.cpu.toFixed(1) ?? '--'"
          unit="%"
        />

        <MetricCard
          label="Active Alerts"
          :value="alerts.length"
        />
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-3">
        <div class="xl:col-span-2">
          <MonitorPanel
            title="Market Overview"
            description="Real-time market data"
          >
            <MarketOverview :ticks="chartTicks" />
            <PerformancePanel :metrics="metrics" />
          </MonitorPanel>
        </div>

        <div class="mb-4 flex items-center gap-2">
          <span class="mr-2 text-sm text-slate-400">
            Data Rate
          </span>

          <button
            v-for="rate in [100, 1000, 5000, 10000]"
            :key="rate"
            class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white"
            @click="setRate(rate)"
          >
            {{ rate >= 1000 ? `${rate / 1000}K` : rate }}/s
          </button>
        </div>

        <MonitorPanel
          title="System Monitor"
          description="Runtime resource usage"
        >
          <SystemOverview :metric="systemMetric" />
        </MonitorPanel>
      </section>

      <section class="mt-4">
        <MonitorPanel
          title="Alert Events"
          description="Recent system events"
        >
          <AlertPanel :alerts="alerts" />
        </MonitorPanel>
      </section>
    </div>
  </main>
</template>