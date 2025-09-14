import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop()
  image?: string; // S3 URL

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parentId?: Types.ObjectId;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: Object })
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  @Prop({ type: [String], default: [] })
  filters?: string[]; // Available filter options for this category

  @Prop({ default: 0 })
  productCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ featured: 1 });
CategorySchema.index({ sortOrder: 1 });

