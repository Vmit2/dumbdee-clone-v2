import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { WishlistModel } from '../models/Wishlist';

export const wishlistRouter = Router();

wishlistRouter.get('/', requireAuth(['customer','admin']), async (req, res) => {
  const user = (req as any).user;
  const doc = await WishlistModel.findOne({ user_id: user.sub });
  res.json(doc || { items: [] });
});

wishlistRouter.post('/', requireAuth(['customer','admin']), async (req, res) => {
  const user = (req as any).user;
  const { product_id } = req.body;
  const doc = await WishlistModel.findOneAndUpdate(
    { user_id: user.sub },
    { $addToSet: { items: { product_id } } },
    { upsert: true, new: true }
  );
  res.status(201).json(doc);
});

wishlistRouter.delete('/', requireAuth(['customer','admin']), async (req, res) => {
  const user = (req as any).user;
  const { product_id } = req.body;
  await WishlistModel.findOneAndUpdate({ user_id: user.sub }, { $pull: { items: { product_id } } });
  res.json({ ok: true });
});


