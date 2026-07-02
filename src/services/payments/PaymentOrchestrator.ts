import { PaymentProcessor, PaymentProcessorCreateParams, PaymentProcessorVerifyParams } from "@/types/payments";
import { MidtransPaymentProcessor } from "./MidtransPaymentProcessor";
import { XenditPaymentProcessor } from "./XenditPaymentProcessor";

export class PaymentOrchestrator {
  private processors: Map<string, PaymentProcessor> = new Map();

  constructor() {
    // Register available payment rails (CEP-8 Pattern)
    this.registerProcessor(new MidtransPaymentProcessor());
    this.registerProcessor(new XenditPaymentProcessor());
  }

  public registerProcessor(processor: PaymentProcessor) {
    this.processors.set(processor.pmi, processor);
  }

  /**
   * Generates a payment request (e.g., QRIS string) using the chosen Payment Gateway.
   * If PMI is not provided, defaults to midtrans.
   */
  public async createPayment(params: PaymentProcessorCreateParams & { pmi?: string }) {
    const pmiToUse = params.pmi || "fiat-qris-midtrans";
    const processor = this.processors.get(pmiToUse);

    if (!processor) {
      throw new Error(`Payment rail for PMI '${pmiToUse}' is not configured or supported.`);
    }

    return await processor.createPaymentRequired(params);
  }

  /**
   * Verifies payment status given the PMI and transaction details.
   */
  public async verifyPayment(pmi: string, params: PaymentProcessorVerifyParams) {
    const processor = this.processors.get(pmi);

    if (!processor) {
      throw new Error(`Payment rail for PMI '${pmi}' is not configured or supported.`);
    }

    return await processor.verifyPayment(params);
  }
}

export const paymentOrchestrator = new PaymentOrchestrator();
