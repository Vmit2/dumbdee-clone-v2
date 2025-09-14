import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get user wishlist' })
  async getWishlist(@Request() req) {
    return this.usersService.getWishlist(req.user.id);
  }

  @Post('wishlist/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  async addToWishlist(@Request() req, @Param('productId') productId: string) {
    return this.usersService.addToWishlist(req.user.id, productId);
  }

  @Delete('wishlist/:productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  async removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    return this.usersService.removeFromWishlist(req.user.id, productId);
  }

  @Patch('location')
  @ApiOperation({ summary: 'Update user location' })
  async updateLocation(@Request() req, @Body() location: any) {
    return this.usersService.updateLocation(req.user.id, location);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  async updatePreferences(@Request() req, @Body() preferences: any) {
    return this.usersService.updatePreferences(req.user.id, preferences);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}

