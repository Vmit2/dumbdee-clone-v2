import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getPresignedPutUrl } from "../utils/s3";

export const router = Router();

router.get("/presign", requireAuth(["vendor", "admin"]), async (req, res) => {
  const { type, vendorId, fileName, productSlug } = req.query as any;
  if (!type || !vendorId || !fileName) return res.status(400).json({ error: "missing_params" });
  const result = await getPresignedPutUrl({
    vendorId,
    productSlug,
    fileName,
    type
  });
  res.json(result);
});

router.post("/notify", requireAuth(["vendor", "admin"]), async (_req, res) => {
  // Stub: enqueue worker for processing video/image
  res.json({ ok: true });
});
