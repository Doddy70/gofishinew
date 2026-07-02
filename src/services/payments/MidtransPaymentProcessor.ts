import {
  PaymentProcessor,
  PaymentProcessorCreateParams,
  PaymentProcessorCreateResult,
  PaymentProcessorVerifyParams,
  PaymentProcessorVerifyResult,
} from "@/types/payments";
// @ts-ignore - midtrans-client missing type definitions sometimes
import midtransClient from "midtrans-client";

export class MidtransPaymentProcessor implements PaymentProcessor {
  public readonly pmi = "fiat-qris-midtrans";
  private coreApi: any;

  constructor() {
    this.coreApi = new midtransClient.CoreApi({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "dummy_server_key",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || "dummy_client_key",
    });
  }

  public async createPaymentRequired(
    params: PaymentProcessorCreateParams
  ): Promise<PaymentProcessorCreateResult> {
    try {
      const chargeParameters = {
        payment_type: "qris",
        transaction_details: {
          order_id: params.requestEventId,
          gross_amount: params.amount,
        },
        custom_field1: params.description || "GoFishi Booking",
      };

      const response = await this.coreApi.charge(chargeParameters);

      // Extract the QRIS string/URL based on Midtrans response structure
      const qrisUrl = response.actions?.find((a: any) => a.name === "generate-qr-code")?.url || response.transaction_id;

      return {
        amount: params.amount,
        description: params.description,
        pmi: this.pmi,
        pay_req: JSON.stringify({ qrisUrl, gatewayId: response.transaction_id }),
      };
    } catch (error) {
      console.error("[MidtransPaymentProcessor] Create failed", error);
      throw new Error("Failed to generate Midtrans QRIS");
    }
  }

  public async verifyPayment(
    params: PaymentProcessorVerifyParams
  ): Promise<PaymentProcessorVerifyResult> {
    try {
      const statusResponse = await this.coreApi.transaction.status(params.requestEventId);
      const isPaid = statusResponse.transaction_status === "settlement" || statusResponse.transaction_status === "capture";
      
      return {
        isVerified: isPaid,
        _meta: {
          status: statusResponse.transaction_status,
          verifiedAt: Date.now(),
          gatewayResponse: statusResponse
        },
      };
    } catch (error) {
      console.error("[MidtransPaymentProcessor] Verify failed", error);
      return { isVerified: false, _meta: { error: String(error) } };
    }
  }
}
