import cron from 'node-cron';
import { Product } from '../modules/product/product.model';

cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const { modifiedCount } = await Product.updateMany(
    { 'offer.end': { $lte: now } },
    { $set: { offer: null, hasOffer: false } },
  );
  console.log(
    `${new Date().toISOString()} — Cleared ${modifiedCount} expired offers`,
  );
});
