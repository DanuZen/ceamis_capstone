import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /** POST /api/v1/onboarding — save onboarding data */
  @Post()
  save(@Body() dto: SaveOnboardingDto) {
    return this.onboardingService.save(dto);
  }

  /** GET /api/v1/onboarding?user_id=xxx — get onboarding data */
  @Get()
  getOnboarding(@Query('user_id') userId: string) {
    return this.onboardingService.getOnboarding(userId);
  }

  /** GET /api/v1/onboarding/status?user_id=xxx */
  @Get('status')
  async getStatus(@Query('user_id') userId: string) {
    const completed = await this.onboardingService.isCompleted(userId);
    return { user_id: userId, onboarding_completed: completed };
  }
}
