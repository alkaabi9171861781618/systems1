import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { subscribeToOrders } from '../lib/orders'
import { Order } from '../types'
import { formatIQD, formatDate } from '../lib/format'

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const stats = useMemo(() => {
    const newCount = orders.filter((o) => o.status === 'new').length
    const inProgress = orders.filter((o) => o.status === 'in_progress' || o.status === 'inspecting').length
    const completed = orders.filter((o) => o.status === 'completed' || o.status === 'delivered').length
    const needsInfo = orders.filter((o) => o.status === 'needs_info').length
    const revenue = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0)
    const profit = orders.reduce((sum, o) => sum + ((o.paidAmount || 0) - (o.cost || 0)), 0)
    return { newCount, inProgress, completed, needsInfo, revenue, profit }
  }, [orders])

  const recent = orders.slice(0, 5)

  const cards = [
    { label: 'طلبات جديدة', value: stats.newCount, tone: 'bg-status-new' },
    { label: 'قيد التنفيذ', value: stats.inProgress, tone: 'bg-status-progress' },
    { label: 'مكتملة', value: stats.completed, tone: 'bg-status-completed' },
    { label: 'تحتاج معلومات', value: stats.needsInfo, tone: 'bg-status-needsInfo' }
  ]

  return (
    <Layout>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-ticket">
            <div className={`mb-2 h-1.5 w-8 rounded-full ${c.tone}`} />
            <p className="text-2xl font-bold text-ink">{loading ? '—' : c.value}</p>
            <p className="text-xs text-graphite/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-ink p-4 text-white shadow-ticket">
          <p className="text-xs text-white/60">إجمالي الإيرادات (مدفوع)</p>
          <p className="mt-1 text-lg font-bold">{loading ? '—' : formatIQD(stats.revenue)}</p>
        </div>
        <div className="rounded-2xl bg-copper p-4 text-white shadow-ticket">
          <p className="text-xs text-white/70">الأرباح التقديرية</p>
          <p className="mt-1 text-lg font-bold">{loading ? '—' : formatIQD(stats.profit)}</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-graphite">آخر الطلبات</h2>
        <Link to="/orders" className="text-sm text-copper">عرض الكل</Link>
      </div>

      <div className="flex flex-col gap-2">
        {loading && <p className="text-sm text-graphite/50">جارِ التحميل...</p>}
        {!loading && recent.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-graphite/50 shadow-ticket">
            لا توجد طلبات بعد. أنشئ أول طلب من زر «طلب جديد».
          </p>
        )}
        {recent.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-2xl border-r-4 border-copper bg-white p-4 shadow-ticket"
          >
            <div>
              <p className="font-semibold text-ink">{order.orderNumber} — {order.customerName}</p>
              <p className="text-xs text-graphite/60">{order.serviceType} · {formatDate(order.receivedDate)}</p>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </Layout>
  )
}
