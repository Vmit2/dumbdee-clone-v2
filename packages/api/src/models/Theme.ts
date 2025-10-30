import { Schema, model } from "mongoose";

const ThemeSchema = new Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    config: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const ThemeModel = model("Theme", ThemeSchema);
