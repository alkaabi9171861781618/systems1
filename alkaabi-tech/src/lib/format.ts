export function formatIQD(amount: number): string {
  return `${new Intl.NumberFormat('en-US').format(amount || 0)} د.ع`
}

export function formatDate(isoOrDateString: string): string {
  if (!isoOrDateString) return '—'
  const date = new Date(isoOrDateString)
  if (isNaN(date.getTime())) return isoOrDateString
  return new Intl.DateTimeFormat('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

export function formatDateTime(iso: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('ar-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}
