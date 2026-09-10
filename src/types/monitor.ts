export interface MarketTick {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: number
}

export interface SystemMetric {
  cpu: number
  memory: number
  networkIn: number
  networkOut: number
  timestamp: number
}

export type AlertLevel = 'info' | 'warning' | 'critical'

export interface AlertEvent {
  id: string
  level: AlertLevel
  message: string
  timestamp: number
}