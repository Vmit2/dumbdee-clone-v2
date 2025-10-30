import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { TicketModel } from '../models/Ticket';

export const supportRouter = Router();

supportRouter.get('/tickets', requireAuth(['admin','support','vendor']), async (req, res) => {
  const { vendor_id } = req.query as any;
  const filter: any = {};
  if (vendor_id) filter.vendor_id = vendor_id;
  res.json(await TicketModel.find(filter).limit(100));
});

supportRouter.post('/tickets', requireAuth(['vendor','admin','support']), async (req, res) => {
  const created = await TicketModel.create(req.body || {});
  res.status(201).json(created);
});

supportRouter.put('/tickets/:id', requireAuth(['admin','support']), async (req, res) => {
  const updated = await TicketModel.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
  res.json(updated);
});


