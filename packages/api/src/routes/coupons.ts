import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { CouponModel } from '../models/Coupon';

export const couponsRouter = Router();

couponsRouter.get('/', async (req, res) => {
  const { code } = req.query as any;
  const filter: any = {};
  if (code) filter.code = code;
  const docs = await CouponModel.find(filter).limit(100);
  res.json(docs);
});

couponsRouter.post('/', requireAuth(['admin']), async (req, res) => {
  const created = await CouponModel.create(req.body);
  res.status(201).json(created);
});

couponsRouter.put('/:id', requireAuth(['admin']), async (req, res) => {
  const updated = await CouponModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

couponsRouter.delete('/:id', requireAuth(['admin']), async (req, res) => {
  await CouponModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});


