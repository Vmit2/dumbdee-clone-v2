import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from '../../schemas/product.schema';
import { Category, CategoryDocument } from '../../schemas/category.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(filters: any = {}) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      trending,
      status = ProductStatus.ACTIVE,
    } = filters;

    const skip = (page - 1) * limit;
    const query: any = { status };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      const categoryDoc = await this.categoryModel.findOne({ 
        $or: [{ slug: category }, { _id: category }] 
      });
      if (categoryDoc) {
        query.categoryId = categoryDoc._id;
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured/Trending filters
    if (featured !== undefined) query.featured = featured === 'true';
    if (trending !== undefined) query.trending = trending === 'true';

    // Sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName')
        .skip(skip)
        .limit(Number(limit))
        .sort(sortOptions),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        featured,
        trending,
      },
    };
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'firstName lastName email');

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return product;
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({ 'seo.slug': slug })
      .populate('categoryId', 'name slug')
      .populate('sellerId', 'firstName lastName email');

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productModel.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    return product;
  }

  async create(productData: any, sellerId: string) {
    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = await this.generateSKU();
    }

    // Generate SEO slug if not provided
    if (!productData.seo?.slug) {
      productData.seo = {
        ...productData.seo,
        slug: this.generateSlug(productData.title),
      };
    }

    const product = new this.productModel({
      ...productData,
      sellerId,
      publishedAt: new Date(),
    });

    await product.save();
    return product.populate('categoryId', 'name slug');
  }

  async update(id: string, updateData: any, sellerId?: string) {
    const query: any = { _id: id };
    if (sellerId) {
      query.sellerId = sellerId; // Ensure sellers can only update their own products
    }

    const product = await this.productModel
      .findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true })
      .populate('categoryId', 'name slug');

    if (!product) {
      throw new NotFoundException('Product not found or access denied');
    }

    return product;
  }

  async delete(id: string, sellerId?: string) {
    const query: any = { _id: id };
    if (sellerId) {
      query.sellerId = sellerId;
    }

    const product = await this.productModel.findOneAndDelete(query);
    if (!product) {
      throw new NotFoundException('Product not found or access denied');
    }

    return { message: 'Product deleted successfully' };
  }

  async getRelatedProducts(productId: string, limit: number = 4) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const relatedProducts = await this.productModel
      .find({
        _id: { $ne: productId },
        categoryId: product.categoryId,
        status: ProductStatus.ACTIVE,
      })
      .populate('categoryId', 'name slug')
      .limit(limit)
      .sort({ salesCount: -1, rating: -1 });

    return relatedProducts;
  }

  async getFeaturedProducts(limit: number = 8) {
    return this.productModel
      .find({ featured: true, status: ProductStatus.ACTIVE })
      .populate('categoryId', 'name slug')
      .limit(limit)
      .sort({ salesCount: -1 });
  }

  async getTrendingProducts(limit: number = 8) {
    return this.productModel
      .find({ trending: true, status: ProductStatus.ACTIVE })
      .populate('categoryId', 'name slug')
      .limit(limit)
      .sort({ viewCount: -1, salesCount: -1 });
  }

  async getHotPicks(limit: number = 8) {
    // Hot picks based on recent sales and high ratings
    return this.productModel
      .find({ status: ProductStatus.ACTIVE })
      .populate('categoryId', 'name slug')
      .limit(limit)
      .sort({ salesCount: -1, rating: -1, createdAt: -1 });
  }

  async updateInventory(productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.inventory < quantity) {
      throw new BadRequestException('Insufficient inventory');
    }

    product.inventory -= quantity;
    product.salesCount += quantity;

    // Update status if out of stock
    if (product.inventory <= 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }

    await product.save();
    return product;
  }

  private async generateSKU(): Promise<string> {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `DD-${timestamp}-${random}`.toUpperCase();
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  async searchProducts(query: string, filters: any = {}) {
    const searchQuery = {
      $text: { $search: query },
      status: ProductStatus.ACTIVE,
      ...filters,
    };

    return this.productModel
      .find(searchQuery, { score: { $meta: 'textScore' } })
      .populate('categoryId', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);
  }
}

