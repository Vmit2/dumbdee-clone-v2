export type Channel = 'email'|'whatsapp';
export class NotificationService {
  async sendEmail(template: string, to: string, vars: Record<string, any>) { return { queued: true, template, to, vars }; }
  async sendWhatsApp(template: string, to: string, vars: Record<string, any>) { return { queued: true, template, to, vars }; }
}
