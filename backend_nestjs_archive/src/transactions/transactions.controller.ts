import {
  Controller, Get, Post, Delete,
  Body, Param, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  /** GET /api/v1/transactions?user_id=xxx&limit=20&offset=0 */
  @Get()
  findAll(
    @Query('user_id') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.txService.findAll(userId, limit, offset);
  }

  /** GET /api/v1/transactions/summary?user_id=xxx */
  @Get('summary')
  getSummary(@Query('user_id') userId: string) {
    return this.txService.getSummary(userId);
  }

  /** GET /api/v1/transactions/:id?user_id=xxx */
  @Get(':id')
  findOne(@Query('user_id') userId: string, @Param('id') id: string) {
    return this.txService.findOne(userId, id);
  }

  /** POST /api/v1/transactions */
  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.txService.create(dto);
  }

  /** DELETE /api/v1/transactions/:id?user_id=xxx */
  @Delete(':id')
  remove(@Query('user_id') userId: string, @Param('id') id: string) {
    return this.txService.remove(userId, id);
  }
}
