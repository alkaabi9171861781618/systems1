import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { subscribeToPublicTracking } from '../lib/orders'
import { PublicTracking, STATUS_ICON, STATUS_LABELS } from '../types'
import { formatDate } from '../lib/format'

export default function Track() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<PublicTracking | null | undefined>(undefined)

  useEffect(() => {
    if (!token) return
    const unsub = subscribeToPublicTracking(token, setData)
    return unsub
  }, [token])

  const isDone = data?.status === 'completed' || data?.status === 'delivered'

  return (
    <div className="flex min-h-screen flex-col items-center bg-ink px-6 py-10 text-white">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="rounded-2xl bg-copper/20 p-3">
          <Wrench size={26} className="text-copper-light" />
        </div>
        <h1 className="text-lg font-bold">ALKAABI TECH</h1>
      </div>

      {data === undefined && <p className="text-white/60">جارِ التحميل...</p>}

      {data === null && (
        <div className="w-full max-w-sm rounded-2xl bg-white/5 p-6 text-center">
          <p className="text-white/70">لم يتم العثور على هذا الطلب. تأكد من الرابط أو الرمز الذي استخدمته.</p>
        </div>
      )}

      {data && (
        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white text-ink shadow-xl">
          <div className={`p-5 text-center ${isDone ? 'bg-status-completed' : 'bg-status-progress'} text-white`}>
            <p className="text-sm opacity-80">طلبك</p>
            <p className="text-2xl font-bold">#{data.orderNumber}</p>
          </div>

          <div className="flex flex-col gap-4 p-6">
            <InfoRow label="الخدمة" value={data.serviceType} />
            <InfoRow label="الجهاز" value={data.deviceType} />
            <InfoRow label="تاريخ الاستلام" value={formatDate(data.receivedDate)} />
            <InfoRow label="الموعد المتوقع" value={formatDate(data.expectedDate)} />

            <div className="mt-2 rounded-xl bg-paper p-4 text-center">
              <p className="mb-1 text-2xl">{STATUS_ICON[data.status]}</p>
              <p className="font-semibold text-ink">{STATUS_LABELS[data.status]}</p>
              {isDone && <p className="mt-2 text-sm text-graphite/70">يمكنك الآن استلام جهازك من المحل.</p>}
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-xs text-white/30">هذه الصفحة تعرض حالة طلبك فقط، ولا تتطلب تسجيل دخول.</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/5 pb-2 text-sm">
      <span className="text-graphite/50">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  )
}
