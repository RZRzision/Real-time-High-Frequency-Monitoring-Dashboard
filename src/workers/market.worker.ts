import {
  createMarketTick,
} from '../utils/mockData'
import { downsampleMarketTicks } from '../utils/downsample'
import type { MarketTick } from '../types/monitor'
import type { MarketWorkerMessage } from '../types/worker'
import type { MarketWorkerCommand } from '../types/worker'

let eventsPerBatch = 100
let updateInterval = 100
const MAX_MARKET_TICKS = 1000
const CHART_POINTS = 120

let timerId: ReturnType<typeof setInterval> | null = null
let marketTicks: MarketTick[] = []

function generateBatch(): MarketTick[] {
  const batchStartTime = Date.now()

  return Array.from(
    { length: eventsPerBatch },
    (_, index) =>
      createMarketTick(
        undefined,
        batchStartTime + index,
      ),
  )
}

function generateUpdate(): void {
  const newTicks = generateBatch()

  marketTicks = [
    ...marketTicks,
    ...newTicks,
  ].slice(-MAX_MARKET_TICKS)

  const chartTicks = downsampleMarketTicks(
    marketTicks,
    CHART_POINTS,
  )

  const message: MarketWorkerMessage = {
    type: 'market-update',
    ticks: newTicks,
    chartTicks,
  }

  self.postMessage(message)
}

function start(): void {
  if (timerId !== null) return

  timerId = setInterval(
    generateUpdate,
    updateInterval,
  )
}

function stop(): void {
  if (timerId === null) {
    return
  }

  clearInterval(timerId)
  timerId = null
}

self.onmessage = (
  event: MessageEvent<MarketWorkerCommand>,
): void => {
  const command = event.data

  if (command === 'start') {
    start()
    return
  }

  if (command === 'stop') {
    stop()
    return
  }

  if (command.type === 'set-rate') {
    const eventsPerSecond = Math.max(
      100,
      command.eventsPerSecond,
    )

    eventsPerBatch = Math.max(
      1,
      Math.floor(eventsPerSecond / 10),
    )

    updateInterval = 100

    stop()
    start()
  }
}

self.onerror = (): void => {
  stop()
}