export const REFUND_STATUSES = {
  NOT_REQUESTED: 'not_requested',
  REQUESTED: 'requested',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const PAYMENT_STATUSES = {
  COMPLETED: 'completed',
  PARTIALLY_REFUNDED: 'partially_refunded',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUSES;
export type RefundStatus = keyof typeof REFUND_STATUSES;
