import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
  vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  message: String,
  status: { type: String, enum: ['open','pending','resolved'], default: 'open' }
}, { timestamps: true });

export const TicketModel = model('Ticket', TicketSchema);


