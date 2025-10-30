import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotificationService } from '../services/notifications';
import { Schema, model } from 'mongoose';

export const notificationsRouter = Router();
const svc = new NotificationService();

notificationsRouter.post('/email/test', requireAuth(['admin']), async (req, res) => {
  const r = await svc.sendEmail(req.body.template || 'order_placed', req.body.to, req.body.vars || {});
  res.json(r);
});

notificationsRouter.post('/whatsapp/test', requireAuth(['admin']), async (req, res) => {
  const r = await svc.sendWhatsApp(req.body.template || 'order_placed', req.body.to, req.body.vars || {});
  res.json(r);
});

notificationsRouter.post('/abandoned-cart', async (req, res) => {
  // Stub endpoint to accept cart reminder requests
  const { email, items } = req.body || {};
  if (!email) return res.status(400).json({ error: 'missing_email' });
  res.status(202).json({ ok: true });
});

notificationsRouter.post('/broadcast/email', requireAuth(['admin']), async (req, res) => {
  const { subject, body, segment } = req.body || {};
  // Stub: accept request; integration pending
  res.status(202).json({ ok: true, channel: 'email', subject, segment });
});

notificationsRouter.post('/broadcast/whatsapp', requireAuth(['admin']), async (req, res) => {
  const { template, segment } = req.body || {};
  res.status(202).json({ ok: true, channel: 'whatsapp', template, segment });
});

// Templates CRUD (stubs)
const TemplateSchema = new (Schema as any)({ name: String, channel: String, body: String });
const TemplateModel = (model as any)('NotificationTemplate', TemplateSchema);

notificationsRouter.get('/templates', requireAuth(['admin']), async (_req, res) => {
  res.json(await TemplateModel.find({}).limit(100));
});

notificationsRouter.post('/templates', requireAuth(['admin']), async (req, res) => {
  const created = await TemplateModel.create(req.body || {});
  res.status(201).json(created);
});

notificationsRouter.put('/templates/:id', requireAuth(['admin']), async (req, res) => {
  const updated = await TemplateModel.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
  res.json(updated);
});

notificationsRouter.delete('/templates/:id', requireAuth(['admin']), async (req, res) => {
  await TemplateModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

notificationsRouter.post('/order-update', requireAuth(['admin']), async (req, res) => {
  const { channel, to, orderId, status } = req.body || {};
  if (!channel || !to) return res.status(400).json({ error: 'missing_params' });
  res.status(202).json({ ok: true, channel, orderId, status });
});


