import { config } from '#src/config'

export const getDisplayDays = () => config.settings.displayDays || 90

export function getDate(date?: Date | null) {
  return (date ?? new Date()).toISOString().split('T')[0]
}

export function getHistoryDates(days = getDisplayDays()) {
  const date = new Date()
  date.setDate(date.getDate() - days)

  return Array.from(Array.from({ length: days }).keys()).map(() => {
    date.setDate(date.getDate() + 1)
    return getDate(date)
  })
}
