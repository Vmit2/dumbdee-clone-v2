import { Router } from 'express';
import { ShippingService } from '../services/shipping';

export const shippingRouter = Router();
const svc = new ShippingService();

shippingRouter.post('/rates', async (req, res) => {
  const { provider = 'shipway', ...payload } = req.body || {};
  const rates = await svc.getRates(provider, payload);
  res.json(rates);
});

shippingRouter.post('/label', async (req, res) => {
  const { provider = 'shipway', shipment } = req.body || {};
  const label = await svc.createLabel(provider, shipment);
  res.json(label);
});

shippingRouter.get('/track/:id', async (req, res) => {
  const { provider = 'shipway' } = req.query as any;
  const info = await svc.track(provider, req.params.id);
  res.json(info);
});


