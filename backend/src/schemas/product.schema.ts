import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export enum ProductCondition {
  NEW = 'new',
  USED = 'used',
  REFURBISHED = 'refurbished',
}

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, unique: true, trim: true })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  comparePrice?: number; // Original price for discount display

  @Prop({ required: true })
  cost: number; // Cost price for sellers

  @Prop({ required: true, min: 0 })
  inventory: number;

  @Prop({ min: 0, default: 0 })
  lowStockThreshold: number;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Prop({ type: String, enum: ProductCondition, default: ProductCondition.NEW })
  condition: ProductCondition;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ type: [String], required: true })
  images: string[]; // S3 URLs

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object })
  variants?: {
    colors?: Array<{
      name: string;
      value: string; // hex code
      images?: string[];
    }>;
    sizes?: Array<{
      name: string;
      value: string;
      inventory?: number;
    }>;
    materials?: string[];
  };

  @Prop({ type: Object })
  specifications?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    material?: string;
    brand?: string;
    model?: string;
    [key: string]: any;
  };

  @Prop({ type: Object })
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost?: number;
    processingTime: number; // days
  };

  @Prop({ type: Object })
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    slug?: string;
  };

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: false })
  trending: boolean;

  @Prop()
  publishedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ trending: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ rating: -1 });

