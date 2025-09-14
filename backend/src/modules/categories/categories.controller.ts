import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get('main')
  @ApiOperation({ summary: 'Get main categories (Women, Men, Kids)' })
  async findMainCategories() {
    return this.categoriesService.findMainCategories();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree structure' })
  async getCategoryTree() {
    return this.categoriesService.getCategoryTree();
  }

  @Get(':id/subcategories')
  @ApiOperation({ summary: 'Get subcategories by parent ID' })
  async findSubCategories(@Param('id') parentId: string) {
    return this.categoriesService.findSubCategories(parentId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (admin only)' })
  async create(@Body() categoryData: any) {
    return this.categoriesService.create(categoryData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category (admin only)' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.categoriesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category (admin only)' })
  async delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}

