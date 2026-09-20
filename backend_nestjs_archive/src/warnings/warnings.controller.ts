import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { WarningsService } from './warnings.service';

@Controller('warnings')
export class WarningsController {
  constructor(private readonly warningsService: WarningsService) {}

  /** GET /api/v1/warnings?user_id=xxx */
  @Get()
  getWarnings(@Query('user_id') userId: string) {
    return this.warningsService.getWarnings(userId);
  }

  /** PATCH /api/v1/warnings/:id/resolve?user_id=xxx */
  @Patch(':id/resolve')
  resolve(@Query('user_id') userId: string, @Param('id') id: string) {
    return this.warningsService.resolveWarning(userId, id);
  }

  /** POST /api/v1/warnings/generate — trigger rule engine */
  @Post('generate')
  generate(
    @Body()
    body: {
      user_id: string;
      health_score: number;
      transactions: any[];
    },
  ) {
    return this.warningsService.generateWarnings(
      body.user_id,
      body.health_score,
      body.transactions,
    );
  }
}
