import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import { router as uploadsRouter } from "./routes/uploads";
import { router as productsRouter } from "./routes/products";
import { router as adminRouter } from "./routes/admin";
import { mountRoutes } from "./routes/routes";
import { ordersRouter } from "./routes/orders";
import { publicRouter } from "./routes/public";
import { maintenanceGuard } from "./middleware/flags";
import { auditLog } from "./middleware/audit";
import { cartsRouter } from "./routes/carts";
import { wishlistRouter } from "./routes/wishlist";
import { couponsRouter } from "./routes/coupons";
import { paymentsRouter } from "./routes/payments";
import { shippingRouter } from "./routes/shipping";
import { notificationsRouter } from "./routes/notifications";
import { payoutsRouter } from "./routes/payouts";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("combined"));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));
app.use(maintenanceGuard);
app.use(auditLog);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/v1/uploads", uploadsRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/admin", adminRouter);
mountRoutes(app);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/carts", cartsRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/coupons", couponsRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/shipping", shippingRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/payouts", payoutsRouter);

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/dumbdee";

async function start() {
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.log(`API listening on :${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
