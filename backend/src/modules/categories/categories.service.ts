import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../../schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(includeInactive: boolean = false) {
    const query = includeInactive ? {} : { isActive: true };
    return this.categoryModel
      .find(query)
      .populate('parentId', 'name slug')
      .sort({ sortOrder: 1, name: 1 });
  }

  async findMainCategories() {
    return this.categoryModel
      .find({ parentId: null, isActive: true })
      .sort({ sortOrder: 1, name: 1 });
  }

  async findSubCategories(parentId: string) {
    return this.categoryModel
      .find({ parentId, isActive: true })
      .sort({ sortOrder: 1, name: 1 });
  }

  async findById(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parentId', 'name slug');
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({ slug, isActive: true })
      .populate('parentId', 'name slug');
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async create(categoryData: any) {
    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = this.generateSlug(categoryData.name);
    }

    const category = new this.categoryModel(categoryData);
    await category.save();
    return category.populate('parentId', 'name slug');
  }

  async update(id: string, updateData: any) {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
      .populate('parentId', 'name slug');

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async delete(id: string) {
    // Check if category has subcategories
    const hasSubcategories = await this.categoryModel.countDocuments({ parentId: id });
    if (hasSubcategories > 0) {
      throw new Error('Cannot delete category with subcategories');
    }

    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }

  async getCategoryTree() {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    // Build tree structure
    const categoryMap = new Map();
    const tree = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category._id.toString(), {
        ...category.toObject(),
        children: [],
      });
    });

    // Second pass: build tree
    categories.forEach(category => {
      const categoryObj = categoryMap.get(category._id.toString());
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId.toString());
        if (parent) {
          parent.children.push(categoryObj);
        }
      } else {
        tree.push(categoryObj);
      }
    });

    return tree;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
}

