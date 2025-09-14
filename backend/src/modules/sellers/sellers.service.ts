import { Injectable } from '@nestjs/common';

@Injectable()
export class SellersService {
  async getDashboard() {
    return { message: 'Seller dashboard data' };
  }
}
