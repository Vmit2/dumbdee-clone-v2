import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { UserModel } from '../models/User';

export const customersRouter = Router();

customersRouter.get('/me/addresses', requireAuth(['customer','admin']), async (req, res) => {
  const userId = (req as any).user?.sub;
  const u = await UserModel.findById(userId);
  res.json(u?.addresses || []);
});

customersRouter.put('/me/addresses', requireAuth(['customer','admin']), async (req, res) => {
  const userId = (req as any).user?.sub;
  const addresses = Array.isArray(req.body) ? req.body : [];
  const u = await UserModel.findByIdAndUpdate(userId, { $set: { addresses } }, { new: true });
  res.json(u?.addresses || []);
});

customersRouter.get('/me/payment-methods', requireAuth(['customer','admin']), async (req, res) => {
  const userId = (req as any).user?.sub;
  const u = await UserModel.findById(userId);
  res.json(u?.payment_methods || []);
});

customersRouter.put('/me/payment-methods', requireAuth(['customer','admin']), async (req, res) => {
  const userId = (req as any).user?.sub;
  const methods = Array.isArray(req.body) ? req.body : [];
  const u = await UserModel.findByIdAndUpdate(userId, { $set: { payment_methods: methods } }, { new: true });
  res.json(u?.payment_methods || []);
});


