import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { PaymentService } from '../services/payments';

export const paymentsRouter = Router();
const svc = new PaymentService();

paymentsRouter.post('/intent', requireAuth(['customer','admin']), async (req, res) => {
  const intent = await svc.createPaymentIntent(req.body);
  res.status(201).json(intent);
});

paymentsRouter.post('/webhook/:provider', async (req, res) => {
  const result = await svc.handleWebhook(req.params.provider as any, req.body);
  res.json(result);
});


