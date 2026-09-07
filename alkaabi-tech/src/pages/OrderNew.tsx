import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { createOrder } from '../lib/orders'
import { todayInputValue } from '../lib/format'

export default function OrderNew() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    deviceType: '',
    serviceType: '',
    description: '',
    receivedDate: todayInputValue(),
    expectedDate: '',
    price: '',
    paidAmount: '',
    cost: '',
    notes: ''
  })

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const order = await createOrder({
        customerName: form.customerName,
        phone: form.phone,
        deviceType: form.deviceType,
        serviceType: form.serviceType,
        description: form.description,
        receivedDate: form.receivedDate,
        expectedDate: form.expectedDate,
        price: Number(form.price) || 0,
        paidAmount: Number(form.paidAmount) || 0,
        cost: Number(form.cost) || 0,
        notes: form.notes
      })
      navigate(`/orders/${order.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-ink/10 bg-white px-4 py-3 outline-none focus:border-copper'
  const labelClass = 'mb-1 block text-sm font-medium text-graphite'

  return (
    <Layout>
      <h2 className="mb-4 text-lg font-bold text-ink">طلب جديد</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>اسم الزبون</label>
          <input required value={form.customerName} onChange={update('customerName')} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>رقم الهاتف</label>
          <input
            required
            value={form.phone}
            onChange={update('phone')}
            className={inputClass}
            dir="ltr"
            inputMode="tel"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>نوع الجهاز</label>
            <input required value={form.deviceType} onChange={update('deviceType')} className={inputClass} placeholder="Laptop" />
          </div>
          <div>
            <label className={labelClass}>نوع الخدمة</label>
            <input required value={form.serviceType} onChange={update('serviceType')} className={inputClass} placeholder="Windows + Drivers" />
          </div>
        </div>

        <div>
          <label className={labelClass}>وصف المشكلة / الخدمة</label>
          <textarea value={form.description} onChange={update('description')} className={inputClass} rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>تاريخ الاستلام</label>
            <input required type="date" value={form.receivedDate} onChange={update('receivedDate')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>الموعد المتوقع</label>
            <input required type="date" value={form.expectedDate} onChange={update('expectedDate')} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>السعر</label>
            <input type="number" min="0" value={form.price} onChange={update('price')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>المدفوع</label>
            <input type="number" min="0" value={form.paidAmount} onChange={update('paidAmount')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>التكلفة</label>
            <input type="number" min="0" value={form.cost} onChange={update('cost')} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>ملاحظات</label>
          <textarea value={form.notes} onChange={update('notes')} className={inputClass} rows={2} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-ink py-3 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'جارِ الحفظ...' : 'حفظ الطلب'}
        </button>
      </form>
    </Layout>
  )
}
