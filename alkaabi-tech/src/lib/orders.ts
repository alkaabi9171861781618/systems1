import {
  collection,
  doc,
  runTransaction,
  writeBatch,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Order, OrderInput, OrderStatus, PublicTracking } from '../types'

const ORDERS = 'orders'
const PUBLIC_TRACKING = 'public_tracking'
const COUNTERS = 'counters'

function nowIso() {
  return new Date().toISOString()
}

// رمز تتبع عشوائي طويل يصعب تخمينه (32 حرف تقريباً)
function generateTrackingToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// يولّد رقم الطلب التالي بأمان حتى لو فُتح طلبان بنفس اللحظة (Transaction)
async function getNextOrderNumber(): Promise<string> {
  const counterRef = doc(db, COUNTERS, 'orders')
  const nextNumber = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef)
    const last = snap.exists() ? (snap.data().lastNumber as number) : 0
    const next = last + 1
    tx.set(counterRef, { lastNumber: next }, { merge: true })
    return next
  })
  return `AK-${String(nextNumber).padStart(4, '0')}`
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const orderNumber = await getNextOrderNumber()
  const trackingToken = generateTrackingToken()
  const timestamp = nowIso()

  const order: Order = {
    ...input,
    id: orderNumber,
    orderNumber,
    trackingToken,
    status: 'new',
    statusHistory: [{ status: 'new', at: timestamp }],
    createdAt: timestamp,
    updatedAt: timestamp
  }

  const publicData: PublicTracking = {
    orderNumber,
    serviceType: order.serviceType,
    deviceType: order.deviceType,
    receivedDate: order.receivedDate,
    expectedDate: order.expectedDate,
    status: order.status,
    updatedAt: timestamp
  }

  const batch = writeBatch(db)
  batch.set(doc(db, ORDERS, orderNumber), order)
  batch.set(doc(db, PUBLIC_TRACKING, trackingToken), publicData)
  await batch.commit()

  return order
}

export async function updateOrderStatus(order: Order, newStatus: OrderStatus, note?: string) {
  const timestamp = nowIso()
  const historyEntry = { status: newStatus, at: timestamp, ...(note ? { note } : {}) }

  const batch = writeBatch(db)
  batch.set(
    doc(db, ORDERS, order.id),
    {
      status: newStatus,
      updatedAt: timestamp,
      statusHistory: [...order.statusHistory, historyEntry]
    },
    { merge: true }
  )
  batch.set(
    doc(db, PUBLIC_TRACKING, order.trackingToken),
    { status: newStatus, updatedAt: timestamp },
    { merge: true }
  )
  await batch.commit()
}

export async function updateOrderFields(orderId: string, fields: Partial<OrderInput>) {
  await writeBatch(db)
    .set(doc(db, ORDERS, orderId), { ...fields, updatedAt: nowIso() }, { merge: true })
    .commit()

  // إذا تغيّر نوع الخدمة أو التواريخ، حدّث النسخة العامة أيضاً
  const publicFields: Partial<PublicTracking> = {}
  if (fields.serviceType !== undefined) publicFields.serviceType = fields.serviceType
  if (fields.deviceType !== undefined) publicFields.deviceType = fields.deviceType
  if (fields.receivedDate !== undefined) publicFields.receivedDate = fields.receivedDate
  if (fields.expectedDate !== undefined) publicFields.expectedDate = fields.expectedDate

  if (Object.keys(publicFields).length > 0) {
    const orderSnap = await getDoc(doc(db, ORDERS, orderId))
    if (orderSnap.exists()) {
      const token = (orderSnap.data() as Order).trackingToken
      await writeBatch(db)
        .set(doc(db, PUBLIC_TRACKING, token), { ...publicFields, updatedAt: nowIso() }, { merge: true })
        .commit()
    }
  }
}

// اشتراك مباشر (real-time) بكل الطلبات، الأحدث أولاً
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, ORDERS), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as Order))
  })
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, ORDERS, orderId))
  return snap.exists() ? (snap.data() as Order) : null
}

export function subscribeToOrder(orderId: string, callback: (order: Order | null) => void) {
  return onSnapshot(doc(db, ORDERS, orderId), (snap) => {
    callback(snap.exists() ? (snap.data() as Order) : null)
  })
}

export async function getPublicTracking(token: string): Promise<PublicTracking | null> {
  const snap = await getDoc(doc(db, PUBLIC_TRACKING, token))
  return snap.exists() ? (snap.data() as PublicTracking) : null
}

export function subscribeToPublicTracking(token: string, callback: (data: PublicTracking | null) => void) {
  return onSnapshot(doc(db, PUBLIC_TRACKING, token), (snap) => {
    callback(snap.exists() ? (snap.data() as PublicTracking) : null)
  })
}

// يستخدم فقط لتفادي أخطاء lint على استيرادات غير مستخدمة حالياً
export type { Timestamp }
export { getDocs }
