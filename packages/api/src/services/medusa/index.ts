type CartItem = { id?: string; productId?: string; title?: string; price: number; qty: number };
type CartInput = { items: CartItem[]; currency?: string; region?: string };

const FX: Record<string, number> = { INR: 1, USD: 0.012, EUR: 0.011 };
const TAX_BY_REGION: Record<string, number> = { IN: 0.18, US: 0.07, EU: 0.2 };

export class MedusaIntegration {
  async calculateCart(cart: CartInput) {
    const items = Array.isArray(cart?.items) ? cart.items : [];
    const region = cart?.region || 'IN';
    const currency = (cart?.currency || 'INR').toUpperCase();
    const fx = FX[currency] ?? 1;
    const subtotalINR = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
    const subtotal = Math.round(subtotalINR * fx * 100) / 100;
    const taxRate = TAX_BY_REGION[region] ?? 0.0;
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const shipping = subtotal > 999 ? 0 : 49 * fx;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;
    return { currency, region, subtotal, taxRate, tax, shipping, total, itemsCount: items.reduce((s, i) => s + (i.qty || 0), 0) };
  }
}
