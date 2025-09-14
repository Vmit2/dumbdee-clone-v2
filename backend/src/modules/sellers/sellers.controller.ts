import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SellersService } from './sellers.service';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.sellersService.getDashboard();
  }
}
