import { QRCodeSVG } from 'qrcode.react'
import { X, Printer } from 'lucide-react'

interface Props {
  orderNumber: string
  trackingUrl: string
  onClose: () => void
}

export default function QRModal({ orderNumber, trackingUrl, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">رمز تتبع الطلب {orderNumber}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-graphite/60 hover:bg-paper print:hidden">
            <X size={20} />
          </button>
        </div>

        <div id="qr-print-area" className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-copper/40 p-6">
          <QRCodeSVG value={trackingUrl} size={200} fgColor="#1C2321" bgColor="#ffffff" />
          <p className="text-center text-sm text-graphite/70">امسح الرمز لمتابعة حالة طلبك</p>
          <p className="text-center text-xs text-graphite/50 break-all">{trackingUrl}</p>
          <p className="text-center text-base font-semibold text-copper">ALKAABI TECH — {orderNumber}</p>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 font-medium text-white print:hidden"
        >
          <Printer size={18} />
          طباعة
        </button>
      </div>
    </div>
  )
}
