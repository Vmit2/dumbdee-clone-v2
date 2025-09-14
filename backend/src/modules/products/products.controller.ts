import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @ApiQuery({ name: 'featured', required: false, type: String })
  @ApiQuery({ name: 'trending', required: false, type: String })
  async findAll(@Query() filters: any) {
    return this.productsService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeatured(@Query('limit') limit: number = 8) {
    return this.productsService.getFeaturedProducts(limit);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTrending(@Query('limit') limit: number = 8) {
    return this.productsService.getTrendingProducts(limit);
  }

  @Get('hot-picks')
  @ApiOperation({ summary: 'Get hot picks products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHotPicks(@Query('limit') limit: number = 8) {
    return this.productsService.getHotPicks(limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'q', required: true, type: String })
  async search(@Query('q') query: string, @Query() filters: any) {
    return this.productsService.searchProducts(query, filters);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (sellers only)' })
  async create(@Body() productData: any, @Request() req) {
    return this.productsService.create(productData, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRelated(@Param('id') id: string, @Query('limit') limit: number = 4) {
    return this.productsService.getRelatedProducts(id, limit);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (sellers can only update their own products)' })
  async update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    // Check if user is admin or seller updating their own product
    const sellerId = req.user.role === 'admin' ? undefined : req.user.id;
    return this.productsService.update(id, updateData, sellerId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (sellers can only delete their own products)' })
  async delete(@Param('id') id: string, @Request() req) {
    const sellerId = req.user.role === 'admin' ? undefined : req.user.id;
    return this.productsService.delete(id, sellerId);
  }
}

