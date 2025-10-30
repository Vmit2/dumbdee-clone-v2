import { Schema, model } from 'mongoose';

const WishlistSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ product_id: { type: Schema.Types.ObjectId, ref: 'Product' }, added_at: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

export const WishlistModel = model('Wishlist', WishlistSchema);


