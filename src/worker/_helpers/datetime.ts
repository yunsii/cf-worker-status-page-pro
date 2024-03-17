export function getDate(date?: Date) {
  return (date ?? new Date()).toISOString().split('T')[0]
}

export function getHistoryDates(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)

  return Array.from(Array.from({ length: days }).keys()).map(() => {
    date.setDate(date.getDate() + 1)
    return getDate(date)
  })
}
