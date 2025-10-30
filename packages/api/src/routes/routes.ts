import type { Express, Router } from "express";
import fs from "fs";
import path from "path";

export function mountRoutes(app: Express) {
  const routesDir = __dirname;
  const files = fs.readdirSync(routesDir).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));
  for (const file of files) {
    if (file === "routes.ts") continue;
    const mod = require(path.join(routesDir, file));
    const exportKeys = Object.keys(mod);
    for (const key of exportKeys) {
      const val = mod[key];
      if (key.endsWith("Router") && typeof val === "function") {
        // mount by convention
        const base = "/api/v1/" + key.replace("Router", "").replace(/\./g, "/");
        app.use(base, val as Router);
      }
    }
  }
}


