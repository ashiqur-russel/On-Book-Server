## Ticket: #1 - Multiple Product Order Enhancement API

### Multple product order

    - Users can successfully add multiple products to an order.
    - A single payment transaction processes all products in the order.
    - For Multiple product order will be different but referred with same payment id.
    - Each product should be referenced in the order collection individually.
    - The order and payment collections are updated correctly.
    - Fix dependent services if needed for payment and order creating.
    - Each product is stored as a separate order document referencing the same payment ID.

## Example data for new changes

### Order

1️⃣ Order Successfully Created (Payment Completed)

```json
{
"email": "user@example.com",
"product": new Types.ObjectId(),
"user": new Types.ObjectId(),
"payment": new Types.ObjectId(),
"status": "completed",
"deliveryStatus": "pending",
"refundStatus": "not_requested",
"quantity": 2,
"totalPrice": 50,
"createdAt": new Date(),
};
```

2️⃣ Order Cancelled (Refund Requested)

```json
{
  "email": "user@example.com",
  "product": new Types.ObjectId(),
  "user": new Types.ObjectId(),
  "payment": new Types.ObjectId(),
  "status": "cancelled",
  "deliveryStatus": "revoked",
  "refundStatus": "requested",
  "quantity": 1,
  "totalPrice": 30,
  "createdAt": new Date(),
};
```

3️⃣ Partial Refund Issued for One Product
Suppose an order had 3 products worth $30, and 1 product worth $12 was refunded.

```json
{
  "email": "user@example.com",
  "product": new Types.ObjectId(),
  "user": new Types.ObjectId(),
  "payment": new Types.ObjectId(),
  "status": "cancelled",
  "deliveryStatus": "revoked",
  "refundStatus": "completed", // Refund successfully issued
  "quantity": 2, // Remaining products
  "totalPrice": 18, // Updated total after partial refund
  "createdAt": new Date(),
};
```

### Payment

1️⃣ User Buys 3 Products ($30)

```json
{
  "email": "user@example.com",
  "stripePaymentId": "pi_XXXXXX",
  "products": [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()],
  "order": new Types.ObjectId(),
  "user": new Types.ObjectId(),
  "status": "completed",
  "createdAt": new Date(),
};
```

2️⃣ User Cancels 1 Product ($12 Refunded, $18 Remaining)

```json
{
  "email": "user@example.com",
  "stripePaymentId": "pi_XXXXXX",
  "products": [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()],
  "order": new Types.ObjectId(),
  "user": new Types.ObjectId(),
  "status": "partially_refunded",
  "refundedAmount": 12,
  "createdAt": new Date(),
};
```

3️⃣ Full Refund (User Cancels Entire Order)

```json
{
  "email": "user@example.com",
  "stripePaymentId": "pi_XXXXXX",
  "products": [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()],
  "order": new Types.ObjectId(),
  "user": new Types.ObjectId(),
  "status": "refunded",
  "refundedAmount": 30,
  "createdAt": new Date(),
};
```

API Response for Payment should be:

```json
{
  "email": "user@example.com",
  "stripePaymentId": "pi_XXXXXX",
  "products": ["64f123abc1234567890defab", "64f123abc1234567890defac"],
  "order": "64f123abc1234567890defad",
  "user": "64f123abc1234567890defae",
  "status": "partially_refunded",
  "refundStatus": "processing",
  "refundedAmount": 12
}
```
