import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { SettingsModel } from "../models/Settings";
import { UserModel } from "../models/User";
import { WishlistModel } from "../models/Wishlist";
import { Schema, model } from 'mongoose';
import { ProductModel } from "../models/Product";

export const router = Router();

router.get("/settings", requireAuth(["admin"]), async (_req, res) => {
  const doc = await SettingsModel.findOne();
  res.json(doc || { features: {} });
});

router.put("/settings", requireAuth(["admin"]), async (req, res) => {
  const update = req.body || {};
  const doc = await SettingsModel.findOneAndUpdate({}, update, { upsert: true, new: true });
  res.json(doc);
});

router.get('/shipping/config', requireAuth(['admin']), async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.shipping || { carriers: ['shipway','shiprocket'], zones: [], overrides: [] });
});

router.put('/shipping/config', requireAuth(['admin']), async (req, res) => {
  const { carriers, zones, overrides } = req.body || {};
  const s = await SettingsModel.findOneAndUpdate({}, { $set: { 'themes.shipping': { carriers, zones, overrides } } }, { upsert: true, new: true });
  res.json(s.themes?.shipping || { carriers, zones, overrides });
});

router.get('/analytics/config', requireAuth(['admin']), async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.analytics || { ga_measurement_id: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', meta_pixel_id: process.env.NEXT_PUBLIC_META_PIXEL_ID || '' });
});

router.put('/analytics/config', requireAuth(['admin']), async (req, res) => {
  const { ga_measurement_id, meta_pixel_id } = req.body || {};
  const s = await SettingsModel.findOneAndUpdate({}, { $set: { 'themes.analytics': { ga_measurement_id, meta_pixel_id } } }, { upsert: true, new: true });
  res.json(s.themes?.analytics || { ga_measurement_id, meta_pixel_id });
});

router.get("/customers", requireAuth(["admin", "staff"]), async (req, res) => {
  const { email, role } = req.query as any;
  const filter: any = {};
  if (email) filter.email = new RegExp(String(email), 'i');
  if (role) filter.role = role;
  const users = await UserModel.find(filter).limit(100);
  res.json(users);
});

router.get("/customers/:id/wishlist", requireAuth(["admin", "staff"]), async (req, res) => {
  const wl = await WishlistModel.findOne({ user_id: req.params.id });
  res.json(wl || { items: [] });
});

// Role update & impersonate stubs
router.put('/customers/:id/role', requireAuth(['admin','superadmin']), async (req, res) => {
  const { role } = req.body || {};
  const u = await UserModel.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true });
  res.json(u);
});

router.put('/customers/:id/lock', requireAuth(['admin','superadmin']), async (req, res) => {
  const { locked } = req.body || {};
  const u = await UserModel.findByIdAndUpdate(req.params.id, { $set: { 'meta.locked': !!locked } }, { new: true });
  res.json({ id: u?._id, locked: !!(u as any)?.meta?.locked });
});

router.post('/impersonate/:vendorId', requireAuth(['admin','superadmin']), async (req, res) => {
  // Stub: issue a placeholder token value to simulate impersonation
  res.json({ token: 'IMPERSONATE_STUB', vendorId: req.params.vendorId });
});

const WebhookSchema = new (Schema as any)({ url: String, event: String });
const WebhookModel = (model as any)('Webhook', WebhookSchema);

router.get('/webhooks', requireAuth(['admin']), async (_req, res) => {
  res.json(await WebhookModel.find({}).limit(100));
});

router.post('/webhooks', requireAuth(['admin']), async (req, res) => {
  const created = await WebhookModel.create(req.body || {});
  res.status(201).json(created);
});

router.delete('/webhooks/:id', requireAuth(['admin']), async (req, res) => {
  await WebhookModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.post('/webhooks/:id/test', requireAuth(['admin']), async (req, res) => {
  res.json({ ok: true, delivered: false });
});

// Campaigns (UTM links) stubs
const CampaignSchema = new (Schema as any)({ name: String, source: String, medium: String, campaign: String, content: String, term: String });
const CampaignModel = (model as any)('Campaign', CampaignSchema);

router.get('/campaigns', requireAuth(['admin']), async (_req, res) => {
  res.json(await CampaignModel.find({}).limit(100));
});

router.post('/campaigns', requireAuth(['admin']), async (req, res) => {
  const created = await CampaignModel.create(req.body || {});
  res.status(201).json(created);
});

router.delete('/campaigns/:id', requireAuth(['admin']), async (req, res) => {
  await CampaignModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Customer orders view
router.get('/customers/:id/orders', requireAuth(['admin','staff']), async (req, res) => {
  const { OrderModel } = require('../models/Order');
  const orders = await OrderModel.find({ user_id: req.params.id }).limit(100);
  res.json(orders);
});

// Reports stubs
router.get('/reports/sales', requireAuth(['admin']), async (_req, res) => {
  res.json({ bySeller: [{ seller: 'demo-vendor', revenue: 10000 }], byCategory: [{ category: 'default', revenue: 5000 }] });
});

router.get('/reports/sales.csv', requireAuth(['admin']), async (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('type,name,revenue\nSeller,demo-vendor,10000\nCategory,default,5000');
});

// Exports stubs
router.get('/exports/products.csv', requireAuth(['admin']), async (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('id,title,slug\n1,Demo Product,demo-product');
});

router.get('/exports/payouts.csv', requireAuth(['admin']), async (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.send('id,seller,amount,currency,status\n1,demo-vendor,1000,INR,paid');
});

// Overview dashboard
router.get('/overview', requireAuth(['admin','superadmin','staff']), async (_req, res) => {
  res.json({ sales: 42, revenue: 123456, orders: 37, active_sellers: 5 });
});

// Taxes config (stored under settings.themes.taxes for now)
router.get('/taxes/config', requireAuth(['admin']), async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.taxes || { rules: [] });
});

router.put('/taxes/config', requireAuth(['admin']), async (req, res) => {
  const { rules } = req.body || {};
  const s = await SettingsModel.findOneAndUpdate({}, { $set: { 'themes.taxes': { rules: rules || [] } } }, { upsert: true, new: true });
  res.json(s.themes?.taxes || { rules: [] });
});

// Marketing popup config
router.get('/marketing/popup', requireAuth(['admin']), async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.marketing?.popup || { enabled: false, message: '' });
});

router.put('/marketing/popup', requireAuth(['admin']), async (req, res) => {
  const { enabled, message } = req.body || {};
  const s = await SettingsModel.findOneAndUpdate({}, { $set: { 'themes.marketing.popup': { enabled: !!enabled, message: message || '' } } }, { upsert: true, new: true });
  res.json(s.themes?.marketing?.popup || { enabled, message });
});

// Featured products config
router.get('/featured', requireAuth(['admin']), async (_req, res) => {
  const s = await SettingsModel.findOne();
  res.json(s?.themes?.featured || { product_ids: [] });
});

router.put('/featured', requireAuth(['admin']), async (req, res) => {
  const { product_ids } = req.body || {};
  const s = await SettingsModel.findOneAndUpdate({}, { $set: { 'themes.featured': { product_ids: product_ids || [] } } }, { upsert: true, new: true });
  res.json(s.themes?.featured || { product_ids: [] });
});

// Staff management stubs
router.get('/staff', requireAuth(['admin','superadmin']), async (_req, res) => {
  res.json(await UserModel.find({ role: { $in: ['staff','admin','support'] } }).limit(100));
});

// Products: duplicate and bulk edit stubs
router.post('/products/:id/duplicate', requireAuth(['admin']), async (req, res) => {
  const src = await ProductModel.findById(req.params.id);
  if (!src) return res.status(404).json({ error: 'not_found' });
  const copy = src.toObject();
  delete (copy as any)._id;
  copy.slug = copy.slug + '-copy-' + Math.floor(Math.random()*1000);
  copy.title = copy.title + ' (Copy)';
  const created = await ProductModel.create(copy);
  res.status(201).json(created);
});

router.put('/products/bulk', requireAuth(['admin']), async (req, res) => {
  const { ids = [], update = {} } = req.body || {};
  await ProductModel.updateMany({ _id: { $in: ids } }, update);
  res.json({ ok: true, updated: ids.length });
});

router.post('/staff', requireAuth(['admin','superadmin']), async (req, res) => {
  const created = await UserModel.create(req.body || {});
  res.status(201).json(created);
});
