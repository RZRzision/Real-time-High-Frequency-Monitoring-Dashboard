import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import type {
  AlertEvent,
  MarketTick,
  SystemMetric,
} from '../types/monitor'

import {
  createAlertEvent,
  createSystemMetric,
} from '../utils/mockData'

import type { MarketWorkerMessage } from '../types/worker'

const MAX_MARKET_TICKS = 1000
const MAX_ALERTS = 50

export function useMockMonitor() {
  const marketTicks = ref<MarketTick[]>([])
  const systemMetric = ref<SystemMetric | null>(null)
  const alerts = ref<AlertEvent[]>([])
  const chartTicks = ref<MarketTick[]>([])

  // Worker 接收到的事件总数
  // Performance Monitor 会根据这个累计值计算 Data Rate
  const receivedEventsTotal = ref(0)

  let marketWorker: Worker | null = null

  const workerError = ref<string | null>(null)

  function updateSystemData(): void {
    systemMetric.value = createSystemMetric()

    // 随机产生告警
    if (Math.random() > 0.7) {
      alerts.value = [
        createAlertEvent(),
        ...alerts.value,
      ].slice(0, MAX_ALERTS)
    }
  }

  function start(): void {
    // 防止重复创建 Worker
    if (marketWorker !== null) {
      return
    }

    workerError.value = null

    const worker = new Worker(
      new URL(
        '../workers/market.worker.ts',
        import.meta.url,
      ),
      {
        type: 'module',
      },
    )

    marketWorker = worker

    worker.onmessage = (
      event: MessageEvent<MarketWorkerMessage>,
    ): void => {
      if (event.data.type !== 'market-update') {
        return
      }

      // 累计 Worker 本次发送过来的事件数量
      receivedEventsTotal.value += event.data.ticks.length

      // 保存原始市场数据，最多保留 1000 条
      marketTicks.value = [
        ...marketTicks.value,
        ...event.data.ticks,
      ].slice(-MAX_MARKET_TICKS)

      // Worker 已经完成降采样，直接给图表使用
      chartTicks.value = event.data.chartTicks

      // 更新系统指标和告警
      updateSystemData()
    }

    worker.onerror = (): void => {
      workerError.value = 'Market worker stopped unexpectedly'
      stop()
    }

    worker.onmessageerror = (): void => {
      workerError.value = 'Market worker message error'
    }

    // 启动 Worker
    worker.postMessage('start')
  }

  function stop(): void {
    if (marketWorker === null) {
      return
    }

    marketWorker.postMessage('stop')
    marketWorker.terminate()
    marketWorker = null
  }

  function setRate(eventsPerSecond: number): void {
    if (marketWorker === null) {
      return
    }

    marketWorker.postMessage({
      type: 'set-rate',
      eventsPerSecond,
    })
  }

  // 页面加载后自动启动
  onMounted(start)

  // 页面销毁时停止 Worker
  onBeforeUnmount(stop)

  return {
    marketTicks,
    chartTicks,
    systemMetric,
    alerts,
    setRate,
    workerError,
    receivedEventsTotal,
    start,
    stop,
  }
}