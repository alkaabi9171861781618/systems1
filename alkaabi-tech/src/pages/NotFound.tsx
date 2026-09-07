import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <p className="text-3xl font-bold text-ink">404</p>
      <p className="text-graphite/60">الصفحة غير موجودة</p>
      <Link to="/dashboard" className="mt-2 rounded-xl bg-ink px-4 py-2 text-sm text-white">
        العودة للرئيسية
      </Link>
    </div>
  )
}
