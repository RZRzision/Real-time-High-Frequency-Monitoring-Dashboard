<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import * as echarts from 'echarts'

import type { MarketTick } from '../types/monitor'

const props = defineProps<{
  ticks: MarketTick[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)

let chart: echarts.ECharts | null = null

// 是否已经安排了一次图表更新
let updateScheduled = false

function renderChart(): void {
  if (!chart) {
    return
  }

  const data = props.ticks.map((tick) => [
    tick.timestamp,
    tick.price,
  ])

  chart.setOption({
    animation: false,

    grid: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    },

    tooltip: {
      trigger: 'axis',
    },

    xAxis: {
      type: 'time',

      axisLabel: {
        color: '#64748b',
      },

      axisLine: {
        lineStyle: {
          color: '#334155',
        },
      },
    },

    yAxis: {
      type: 'value',
      scale: true,

      axisLabel: {
        color: '#64748b',
      },

      splitLine: {
        lineStyle: {
          color: '#1e293b',
        },
      },
    },

    series: [
      {
        type: 'line',
        data,

        showSymbol: false,
        smooth: false,

        lineStyle: {
          width: 2,
        },
      },
    ],
  })
}

function scheduleChartUpdate(): void {
  // 已经安排过更新，就不重复安排
  if (updateScheduled) {
    return
  }

  updateScheduled = true

  requestAnimationFrame(() => {
    updateScheduled = false

    renderChart()
  })
}

function handleResize(): void {
  chart?.resize()
}

onMounted(async () => {
  await nextTick()

  if (!chartRef.value) {
    return
  }

  chart = echarts.init(chartRef.value)

  renderChart()

  window.addEventListener(
    'resize',
    handleResize,
  )
})

watch(
  () => props.ticks,
  () => {
    scheduleChartUpdate()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener(
    'resize',
    handleResize,
  )

  chart?.dispose()
  chart = null

  updateScheduled = false
})
</script>

<template>
  <div
    class="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
  >
    <div class="mb-4">
      <p class="text-sm font-medium text-slate-200">
        Market Price
      </p>

      <p class="mt-1 text-xs text-slate-500">
        Real-time price stream
      </p>
    </div>

    <div
      ref="chartRef"
      class="h-80 w-full"
    />
  </div>
</template>