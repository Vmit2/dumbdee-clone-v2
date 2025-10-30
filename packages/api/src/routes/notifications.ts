import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotificationService } from '../services/notifications';

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


