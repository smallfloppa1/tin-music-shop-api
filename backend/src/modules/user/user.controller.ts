import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { type RequestWithUser } from '../auth/type/request-with-user.interface';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req: RequestWithUser): Promise<UserDto> {
    return this.userService.getById(req.user.sub);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserDto> {
    return this.userService.getById(id);
  }

  @Patch('me')
  async updateCurrentUser(
    @Request() req: RequestWithUser,
    @Body() user: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(req.user.sub, user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
