import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async processPayment() {
    return { message: 'Payment processing' };
  }
}
