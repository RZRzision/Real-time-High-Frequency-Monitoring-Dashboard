import type {
  AlertEvent,
  AlertLevel,
  MarketTick,
  SystemMetric,
} from '../types/monitor'

const symbols = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT']
let currentPrice = 105000

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]
}

export function createMarketTick(
  symbol?: string,
  timestamp: number = Date.now(),
): MarketTick {
  const priceChange = random(-30, 30)

  currentPrice += priceChange

  if (currentPrice < 90000) {
    currentPrice = 90000
  }

  if (currentPrice > 120000) {
    currentPrice = 120000
  }

  const price = currentPrice

  return {
    symbol: symbol ?? randomItem(symbols),
    price,
    change: priceChange,
    changePercent: (priceChange / price) * 100,
    volume: random(100, 10000),
    timestamp,
  }
}

export function createSystemMetric(): SystemMetric {
  return {
    cpu: random(10, 95),
    memory: random(20, 90),
    networkIn: random(1, 100),
    networkOut: random(1, 100),
    timestamp: Date.now(),
  }
}

export function createAlertEvent(): AlertEvent {
  const level: AlertLevel = randomItem([
    'info',
    'warning',
    'critical',
  ] as const)

  const messages: Record<AlertLevel, string> = {
    info: 'Data stream connected',
    warning: 'CPU usage is above threshold',
    critical: 'Data processing latency is too high',
  }

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    level,
    message: messages[level],
    timestamp: Date.now(),
  }
}