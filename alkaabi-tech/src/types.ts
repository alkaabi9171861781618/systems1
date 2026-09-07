export type OrderStatus =
  | 'new'
  | 'inspecting'
  | 'in_progress'
  | 'needs_info'
  | 'completed'
  | 'delivered'
  | 'cancelled'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'جديد',
  inspecting: 'قيد الفحص',
  in_progress: 'قيد التنفيذ',
  needs_info: 'يحتاج معلومات',
  completed: 'مكتمل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي'
}

export const STATUS_ORDER: OrderStatus[] = [
  'new',
  'inspecting',
  'in_progress',
  'needs_info',
  'completed',
  'delivered',
  'cancelled'
]

// لون كل حالة (يطابق tailwind.config.js -> colors.status)
export const STATUS_COLOR_CLASS: Record<OrderStatus, string> = {
  new: 'bg-status-new',
  inspecting: 'bg-status-inspecting',
  in_progress: 'bg-status-progress',
  needs_info: 'bg-status-needsInfo',
  completed: 'bg-status-completed',
  delivered: 'bg-status-delivered',
  cancelled: 'bg-status-cancelled'
}

// الرمز المعروض بصفحة تتبع الزبون
export const STATUS_ICON: Record<OrderStatus, string> = {
  new: '🔵',
  inspecting: '🟡',
  in_progress: '🟡',
  needs_info: '🟠',
  completed: '🟢',
  delivered: '🟢',
  cancelled: '⚪'
}

export interface StatusHistoryEntry {
  status: OrderStatus
  at: string // ISO date string
  note?: string
}

export interface Order {
  id: string // نفس orderNumber، مثل AK-0001
  orderNumber: string
  customerName: string
  phone: string
  deviceType: string
  serviceType: string
  description: string
  receivedDate: string // YYYY-MM-DD
  expectedDate: string // YYYY-MM-DD
  price: number
  paidAmount: number
  cost: number
  notes: string
  status: OrderStatus
  trackingToken: string
  statusHistory: StatusHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export type OrderInput = Omit<
  Order,
  'id' | 'orderNumber' | 'trackingToken' | 'statusHistory' | 'createdAt' | 'updatedAt' | 'status'
>

// الشكل العام لبيانات صفحة التتبع (بدون أي معلومات حساسة عن الزبون)
export interface PublicTracking {
  orderNumber: string
  serviceType: string
  deviceType: string
  receivedDate: string
  expectedDate: string
  status: OrderStatus
  updatedAt: string
}
