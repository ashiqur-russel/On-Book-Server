export const ORDER_STATUSES = {
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REVOKED: 'revoked',
} as const;

export const DELIVERY_STATUSES = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  REVOKED: 'revoked',
  CANCELLED: 'cancelled',
} as const;

export const REFUND_STATUSES = {
  NOT_REQUESTED: 'not_requested',
  REQUESTED: 'requested',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;
export type DeliveryStatus = keyof typeof DELIVERY_STATUSES;
export type RefundStatus = keyof typeof REFUND_STATUSES;
