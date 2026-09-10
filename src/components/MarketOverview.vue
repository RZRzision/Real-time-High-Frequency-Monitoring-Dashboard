<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import * as echarts from 'echarts'
import type { MarketTick } from '../types/monitor'
import { downsampleMarketTicks } from '../utils/downsample'

interface Props {
  ticks: MarketTick[]
}

const props = defineProps<Props>()

const chartTicks = computed(() =>
  downsampleMarketTicks(props.ticks, 120),
)

const chartRef = ref<HTMLDivElement | null>(null)

let chart: echarts.ECharts | null = null

function updateChart(): void {
  if (!chart) {
    return
  }

const data = chartTicks.value.map((tick) => [
  tick.timestamp,
  tick.price,
])

  chart.setOption({
    animation: false,

    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 60,
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
      },
    ],
  })
}

function resizeChart(): void {
  chart?.resize()
}

onMounted(() => {
  if (!chartRef.value) {
    return
  }

  chart = echarts.init(chartRef.value)

  updateChart()

  window.addEventListener('resize', resizeChart)
})

let updateFrameId: number | null = null

function scheduleChartUpdate(): void {
  if (updateFrameId !== null) {
    return
  }

  updateFrameId = requestAnimationFrame(() => {
    updateFrameId = null
    updateChart()
  })
}

watch(
  chartTicks,
  () => {
    scheduleChartUpdate()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)

  if (updateFrameId !== null) {
    cancelAnimationFrame(updateFrameId)
    updateFrameId = null
  }

  chart?.dispose()
  chart = null
})
</script>

<template>
  <div
    ref="chartRef"
    class="h-72 w-full"
  />
</template>