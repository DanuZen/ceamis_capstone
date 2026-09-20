import { Controller, Get, Put, Patch, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfileDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /api/v1/users/:id */
  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  /** PUT /api/v1/users/:id/profile */
  @Put(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.usersService.upsertProfile(id, dto);
  }

  /** PATCH /api/v1/users/:id/xp */
  @Patch(':id/xp')
  addXp(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.usersService.addXp(id, amount);
  }

  /** PATCH /api/v1/users/:id/streak */
  @Patch(':id/streak')
  updateStreak(@Param('id') id: string) {
    return this.usersService.updateStreak(id);
  }
}
