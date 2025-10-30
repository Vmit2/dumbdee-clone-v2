import { Router } from 'express';
import { MedusaIntegration } from '../services/medusa';

export const cartsRouter = Router();
const svc = new MedusaIntegration();

cartsRouter.post('/calculate', async (req, res) => {
  const cart = req.body || {};
  const result = await svc.calculateCart(cart);
  res.json(result);
});


