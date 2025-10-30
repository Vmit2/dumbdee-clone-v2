import 'dotenv/config';
import mongoose from 'mongoose';
import { VendorModel } from '../packages/api/src/models/Vendor';
import { ProductModel } from '../packages/api/src/models/Product';

async function main() {
  const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/dumbdee';
  await mongoose.connect(mongo);

  await VendorModel.deleteMany({});
  await ProductModel.deleteMany({});

  const vendors = await VendorModel.insertMany([
    { user_id: new mongoose.Types.ObjectId(), slug: 'vendor-a', name: 'Vendor A', status: 'active' },
    { user_id: new mongoose.Types.ObjectId(), slug: 'vendor-b', name: 'Vendor B', status: 'active' },
    { user_id: new mongoose.Types.ObjectId(), slug: 'vendor-c', name: 'Vendor C', status: 'active' }
  ]);

  const prodDocs = [] as any[];
  for (let i = 1; i <= 10; i++) {
    const v = vendors[i % vendors.length];
    prodDocs.push({
      vendor_id: v._id,
      title: `Sample Product ${i}`,
      slug: `sample-product-${i}`,
      description: 'Seeded product',
      variants: [{ sku: `SKU-${i}`, price: 1999 + i, currency: 'INR', stock: 10 }],
      status: 'published'
    });
  }
  await ProductModel.insertMany(prodDocs);
  console.log('Seeded vendors and products');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
