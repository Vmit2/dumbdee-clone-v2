import { Router } from 'express';
import { ShippingService } from '../services/shipping';

export const shippingRouter = Router();
const svc = new ShippingService();

shippingRouter.post('/rates', async (req, res) => {
  const { provider = 'shipway', ...payload } = req.body || {};
  const rates = await svc.getRates(provider, payload);
  res.json(rates);
});


