export type ShippingProvider = 'shiprocket'|'shipway';
export class ShippingService {
  async getRates(provider: ShippingProvider, payload: any) {
    if (provider === 'shipway') {
      return [{ service: 'Shipway Standard', amount: 99, currency: 'INR', eta_days: 3 }];
    }
    return [{ service: 'Default Ground', amount: 149, currency: payload?.currency || 'INR', eta_days: 5 }];
  }
  async createLabel(_provider: ShippingProvider, _shipment: any) { return { labelUrl: '' }; }
  async track(_provider: ShippingProvider, _trackingId: string) { return { status: 'pending' }; }
}
