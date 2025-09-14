import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll() {
    return this.orderModel.find().populate('customerId', 'firstName lastName email');
  }

  async findById(id: string) {
    return this.orderModel.findById(id).populate('customerId', 'firstName lastName email');
  }

  async create(orderData: any) {
    const order = new this.orderModel(orderData);
    return order.save();
  }

  async update(id: string, updateData: any) {
    return this.orderModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}

