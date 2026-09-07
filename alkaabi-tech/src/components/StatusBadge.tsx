import { STATUS_COLOR_CLASS, STATUS_LABELS, OrderStatus } from '../types'

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-ink shadow-ticket">
      <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR_CLASS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  )
}
