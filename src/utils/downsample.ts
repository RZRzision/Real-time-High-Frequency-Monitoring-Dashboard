import type { MarketTick } from '../types/monitor'

export function downsampleMarketTicks(
  ticks: readonly MarketTick[],
  targetPoints: number,
): MarketTick[] {
  if (ticks.length <= targetPoints) {
    return [...ticks]
  }

  if (targetPoints < 2) {
    return [ticks[ticks.length - 1]]
  }

  const bucketSize = ticks.length / targetPoints
  const result: MarketTick[] = []

  for (let index = 0; index < targetPoints; index += 1) {
    const start = Math.floor(index * bucketSize)
    const end = Math.min(
      Math.floor((index + 1) * bucketSize),
      ticks.length,
    )

    const bucket = ticks.slice(start, end)

    if (bucket.length === 0) {
      continue
    }

    let minTick = bucket[0]
    let maxTick = bucket[0]

    for (const tick of bucket) {
      if (tick.price < minTick.price) {
        minTick = tick
      }

      if (tick.price > maxTick.price) {
        maxTick = tick
      }
    }

    if (minTick.timestamp <= maxTick.timestamp) {
      result.push(minTick)

      if (minTick !== maxTick) {
        result.push(maxTick)
      }
    } else {
      result.push(maxTick)

      if (minTick !== maxTick) {
        result.push(minTick)
      }
    }
  }

  return result
}