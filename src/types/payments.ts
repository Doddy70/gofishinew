// Based on CEP-8 PaymentProcessor patterns from @contextvm/sdk/payments

export interface PaymentProcessorCreateParams {
  amount: number;
  description?: string;
  requestEventId: string; // The unique transaction/reservation ID
  currencyUnit?: string;
}

export interface PaymentProcessorVerifyParams {
  requestEventId: string;
  transactionId?: string; // Optional gateway specific ID
}

export interface PaymentProcessorCreateResult {
  amount: number;
  pay_req: string; // The QRIS string, checkout URL, or token
  description?: string;
  pmi: string; // Payment Method Identifier (e.g., 'fiat-qris-midtrans')
}

export interface PaymentProcessorVerifyResult {
  isVerified: boolean;
  _meta?: Record<string, unknown>;
}

export interface PaymentProcessor {
  /**
   * The stable Payment Method Identifier for this rail.
   * Examples: 'fiat-qris-midtrans', 'fiat-qris-xendit'
   */
  readonly pmi: string;

  /**
   * Issue a payment request (e.g., generate a QRIS code or Checkout URL)
   */
  createPaymentRequired(
    params: PaymentProcessorCreateParams
  ): Promise<PaymentProcessorCreateResult>;

  /**
   * Verify if a payment has been settled.
   */
  verifyPayment(
    params: PaymentProcessorVerifyParams
  ): Promise<PaymentProcessorVerifyResult>;
}
