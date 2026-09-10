import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import type { PerformanceMetrics } from '../types/performance'

export function usePerformanceMonitor(
  totalEvents: () => number,
  bufferSize: () => number,
  chartPoints: () => number,
) {
  const metrics = ref<PerformanceMetrics>({
    dataRate: 0,
    renderFps: 0,
    bufferSize: 0,
    chartPoints: 0,
  })

  let frameId: number | null = null

  let lastFrameTime = performance.now()
  let lastRateTime = performance.now()

  let frameCount = 0
  let lastEventCount = totalEvents()

  function measure(time: number): void {
    frameCount += 1

    const frameElapsed = time - lastFrameTime

    if (frameElapsed >= 1000) {
      metrics.value.renderFps = Math.round(
        (frameCount * 1000) / frameElapsed,
      )

      frameCount = 0
      lastFrameTime = time
    }

    const rateElapsed = time - lastRateTime

    if (rateElapsed >= 1000) {
      const currentEventCount = totalEvents()

      metrics.value.dataRate = Math.round(
        ((currentEventCount - lastEventCount) * 1000) /
        rateElapsed,
      )

      metrics.value.bufferSize = bufferSize()
      metrics.value.chartPoints = chartPoints()

      lastEventCount = currentEventCount
      lastRateTime = time
    }

    frameId = requestAnimationFrame(measure)
  }

  onMounted(() => {
    frameId = requestAnimationFrame(measure)
  })

  onBeforeUnmount(() => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  })

  return {
    metrics,
  }
}