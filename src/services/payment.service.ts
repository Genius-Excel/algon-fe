import apiClient from "./api";
import { mockPaymentService } from "./mock.service";

const USE_MOCK = false; // API integration enabled

export interface PaymentInitializeRequest {
  email: string;
  amount: number; // Amount in Naira (backend converts to kobo)
  metadata?: {
    applicantName?: string;
    nin?: string;
    lga?: string;
    state?: string;
    serviceType?: "application" | "digitization";
    [key: string]: any;
  };
}

export interface PaymentInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationData {
  reference: string;
}

class PaymentService {
  /**
   * Initialize payment - Backend handles Paystack
   */
  async initializePayment(
    data: PaymentInitializeRequest
  ): Promise<PaymentInitializeResponse> {
    if (USE_MOCK) {
      return mockPaymentService.initializePayment(data);
    }

    const response = await apiClient.post("/payments/initialize/", data);
    return response.data;
  }

  /**
   * Verify payment after completion
   */
  async verifyPayment(reference: string) {
    if (USE_MOCK) {
      return mockPaymentService.verifyPayment({ reference });
    }

    const response = await apiClient.post("/payments/verify/", { reference });
    return response.data;
  }

  /**
   * Get payment history
   */
  async getPaymentHistory() {
    if (USE_MOCK) {
      return mockPaymentService.getPaymentHistory();
    }

    const response = await apiClient.get("/payments/history/");
    return response.data;
  }
}

export default new PaymentService();
