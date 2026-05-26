import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** POST /api/v1/ai/health-score */
  @Post('health-score')
  getHealthScore(
    @Body()
    body: {
      user_id: string;
      monthly_income: number;
      monthly_expense: number;
      savings_ratio: number;
      risk_profile?: string;
    },
  ) {
    return this.aiService.getHealthScore(body);
  }

  /** POST /api/v1/ai/spending-cluster */
  @Post('spending-cluster')
  getSpendingCluster(
    @Body()
    body: {
      user_id: string;
      category_breakdown: Record<string, number>;
      total_transactions: number;
    },
  ) {
    return this.aiService.getSpendingCluster(body);
  }

  /** POST /api/v1/ai/chat */
  @Post('chat')
  chat(
    @Body()
    body: {
      user_id: string;
      message: string;
      context?: object;
    },
  ) {
    return this.aiService.chat(body);
  }
}
