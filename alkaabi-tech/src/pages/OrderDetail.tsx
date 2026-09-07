import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QrCode, Pencil, Check, X } from 'lucide-react'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import QRModal from '../components/QRModal'
import { subscribeToOrder, updateOrderStatus, updateOrderFields } from '../lib/orders'
import { Order, OrderStatus, STATUS_LABELS, STATUS_ORDER } from '../types'
import { formatIQD, formatDate, formatDateTime } from '../lib/format'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [editing, setEditing] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)
  const [draft, setDraft] = useState<Partial<Order>>({})

  useEffect(() => {
    if (!id) return
    const unsub = subscribeToOrder(id, (data) => {
      setOrder(data)
      setLoading(false)
    })
    return unsub
  }, [id])

  if (loading) {
    return (
      <Layout>
        <p className="text-sm text-graphite/50">جارِ التحميل...</p>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-graphite/50 shadow-ticket">
          لم يتم العثور على هذا الطلب.
        </p>
      </Layout>
    )
  }

  const trackingUrl = `${window.location.origin}/track/${order.trackingToken}`
  const remaining = (order.price || 0) - (order.paidAmount || 0)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return
    setSavingStatus(true)
    try {
      await updateOrderStatus(order, newStatus)
    } finally {
      setSavingStatus(false)
    }
  }

  const startEdit = () => {
    setDraft({
      customerName: order.customerName,
      phone: order.phone,
      deviceType: order.deviceType,
      serviceType: order.serviceType,
      description: order.description,
      expectedDate: order.expectedDate,
      price: order.price,
      paidAmount: order.paidAmount,
      cost: order.cost,
      notes: order.notes
    })
    setEditing(true)
  }

  const saveEdit = async () => {
    await updateOrderFields(order.id, draft as any)
    setEditing(false)
  }

  const inputClass = 'w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-copper'

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">{order.orderNumber}</h2>
          <p className="text-xs text-graphite/50">أُنشئ {formatDateTime(order.createdAt)}</p>
        </div>
        <button onClick={() => setShowQR(true)} className="flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-sm text-white">
          <QrCode size={16} />
          QR
        </button>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-ticket">
        <p className="mb-2 text-xs font-medium text-graphite/50">الحالة الحالية</p>
        <div className="mb-3"><StatusBadge status={order.status} /></div>
        <select
          value={order.status}
          disabled={savingStatus}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          className="w-full rounded-xl border border-ink/10 bg-paper px-3 py-2 text-sm"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 rounded-2xl bg-white p-4 shadow-ticket">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">تفاصيل الطلب</p>
          {!editing ? (
            <button onClick={startEdit} className="flex items-center gap-1 text-sm text-copper">
              <Pencil size={14} /> تعديل
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveEdit} className="flex items-center gap-1 text-sm text-status-completed">
                <Check size={14} /> حفظ
              </button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-graphite/50">
                <X size={14} /> إلغاء
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <dl className="flex flex-col gap-2 text-sm">
            <Row label="الزبون" value={order.customerName} />
            <Row label="الهاتف" value={order.phone} dir="ltr" />
            <Row label="الجهاز" value={order.deviceType} />
            <Row label="الخدمة" value={order.serviceType} />
            <Row label="الوصف" value={order.description || '—'} />
            <Row label="تاريخ الاستلام" value={formatDate(order.receivedDate)} />
            <Row label="الموعد المتوقع" value={formatDate(order.expectedDate)} />
            <Row label="السعر" value={formatIQD(order.price)} />
            <Row label="المدفوع" value={formatIQD(order.paidAmount)} />
            <Row label="المتبقي" value={formatIQD(remaining)} highlight={remaining > 0} />
            <Row label="ملاحظات" value={order.notes || '—'} />
          </dl>
        ) : (
          <div className="flex flex-col gap-3">
            <Field label="الزبون">
              <input className={inputClass} value={draft.customerName ?? ''} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })} />
            </Field>
            <Field label="الهاتف">
              <input className={inputClass} dir="ltr" value={draft.phone ?? ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
            <Field label="الجهاز">
              <input className={inputClass} value={draft.deviceType ?? ''} onChange={(e) => setDraft({ ...draft, deviceType: e.target.value })} />
            </Field>
            <Field label="الخدمة">
              <input className={inputClass} value={draft.serviceType ?? ''} onChange={(e) => setDraft({ ...draft, serviceType: e.target.value })} />
            </Field>
            <Field label="الوصف">
              <textarea className={inputClass} rows={2} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <Field label="الموعد المتوقع">
              <input type="date" className={inputClass} value={draft.expectedDate ?? ''} onChange={(e) => setDraft({ ...draft, expectedDate: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="السعر">
                <input type="number" className={inputClass} value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
              </Field>
              <Field label="المدفوع">
                <input type="number" className={inputClass} value={draft.paidAmount ?? 0} onChange={(e) => setDraft({ ...draft, paidAmount: Number(e.target.value) })} />
              </Field>
              <Field label="التكلفة">
                <input type="number" className={inputClass} value={draft.cost ?? 0} onChange={(e) => setDraft({ ...draft, cost: Number(e.target.value) })} />
              </Field>
            </div>
            <Field label="ملاحظات">
              <textarea className={inputClass} rows={2} value={draft.notes ?? ''} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </Field>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-ticket">
        <p className="mb-3 text-sm font-semibold text-ink">سجل الحالات</p>
        <ol className="flex flex-col gap-3">
          {order.statusHistory
            .slice()
            .reverse()
            .map((h, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-graphite">{STATUS_LABELS[h.status]}</span>
                <span className="text-xs text-graphite/50">{formatDateTime(h.at)}</span>
              </li>
            ))}
        </ol>
      </div>

      {showQR && <QRModal orderNumber={order.orderNumber} trackingUrl={trackingUrl} onClose={() => setShowQR(false)} />}
    </Layout>
  )
}

function Row({ label, value, dir, highlight }: { label: string; value: string; dir?: 'ltr' | 'rtl'; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/5 pb-2 last:border-0 last:pb-0">
      <dt className="text-graphite/50">{label}</dt>
      <dd className={`font-medium ${highlight ? 'text-status-needsInfo' : 'text-ink'}`} dir={dir}>{value}</dd>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-graphite/60">{label}</label>
      {children}
    </div>
  )
}
