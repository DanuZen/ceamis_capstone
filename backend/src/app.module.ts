import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';

import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AiModule } from './ai/ai.module';
import { WarningsModule } from './warnings/warnings.module';

@Module({
  imports: [
    // Config — load .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,  // max 100 requests per minute
      },
    ]),

    // HTTP client (for calling FastAPI)
    HttpModule,

    // Core modules
    SupabaseModule,
    UsersModule,
    TransactionsModule,
    OnboardingModule,
    AiModule,
    WarningsModule,
  ],
})
export class AppModule {}
