import type { ProductExtraGroupDto } from '@/types/store'
import { parsePrice } from '@/lib/format'

export type ExtraOpt = { id: number; name: string; finalPrice: number }

export function getAvailableOptions(group: ProductExtraGroupDto): ExtraOpt[] {
  if (group.customOptions?.length) {
    return group.customOptions.map((co) => ({
      id: co.option.id,
      name: co.option.name,
      finalPrice:
        co.priceOverride !== null && co.priceOverride !== ''
          ? parsePrice(co.priceOverride)
          : parsePrice(co.option.price),
    }))
  }
  return group.group.options
    .filter((o) => o.active)
    .map((o) => ({
      id: o.id,
      name: o.name,
      finalPrice: parsePrice(o.price),
    }))
}

export function maxForGroup(group: ProductExtraGroupDto): number {
  if (group.maxSelections != null) return group.maxSelections
  if (group.group.maxSelections != null) return group.group.maxSelections
  return 999
}
