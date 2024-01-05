import { pluralize } from '@/components/Helpers'
import Tag from './Tag'

async function RelativeTime({ unixTimestamp }: { unixTimestamp: number }) {
  const date = new Date(unixTimestamp * 1000)
  const delta = Date.now() - date.getTime()
  const seconds = Math.abs(delta) / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const years = days / 365

  let relativeText

  if (years > 1) {
    relativeText = `${pluralize('year', Math.round(years))} ago`
  } else if (days > 1) {
    relativeText = `${pluralize('day', Math.round(days))} ago`
  } else if (hours > 1) {
    relativeText = `${pluralize('hour', Math.round(hours))} ago`
  } else if (minutes > 1) {
    relativeText = `${pluralize('minute', Math.round(minutes))} ago`
  } else {
    relativeText = 'just now'
  }

  return (
    <time dateTime={date.toISOString()} className="">
      <Tag text={relativeText} />
    </time>
  )
}

export default RelativeTime
