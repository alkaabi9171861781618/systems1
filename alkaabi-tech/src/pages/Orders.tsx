import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { subscribeToOrders } from '../lib/orders'
import { Order, OrderStatus, STATUS_LABELS, STATUS_ORDER } from '../types'
import { formatDate } from '../lib/format'

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.orderNumber.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [orders, search, statusFilter])

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-ticket">
        <Search size={18} className="text-graphite/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الهاتف أو رقم الطلب..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-graphite/40"
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
            statusFilter === 'all' ? 'bg-ink text-white' : 'bg-white text-graphite/60'
          }`}
        >
          الكل
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              statusFilter === s ? 'bg-ink text-white' : 'bg-white text-graphite/60'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {loading && <p className="text-sm text-graphite/50">جارِ التحميل...</p>}
        {!loading && filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-graphite/50 shadow-ticket">
            لا توجد طلبات مطابقة.
          </p>
        )}
        {filtered.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-2xl border-r-4 border-copper bg-white p-4 shadow-ticket"
          >
            <div>
              <p className="font-semibold text-ink">{order.orderNumber} — {order.customerName}</p>
              <p className="text-xs text-graphite/60">
                {order.deviceType} · {order.serviceType} · {formatDate(order.receivedDate)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        ))}
      </div>
    </Layout>
  )
}
