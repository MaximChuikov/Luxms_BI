import { format } from 'date-fns'

type Config = {
  isEndDate?: boolean
}

export const dateToDbFormat = (date: Date, { isEndDate }: Config = {}) => {
  let targetDate = new Date(date.getTime())
  if (isEndDate) {
    targetDate = new Date(date.setDate(date.getDate() + 1))
  }
  return format(targetDate, 'yyy-MM-dd')
}
