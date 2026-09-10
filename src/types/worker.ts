import type { MarketTick } from './monitor'

export type MarketWorkerCommand =
  | 'start'
  | 'stop'
  | {
    type: 'set-rate'
    eventsPerSecond: number
  }

export interface MarketWorkerMessage {
  type: 'market-update'
  ticks: MarketTick[]
  chartTicks: MarketTick[]
} 