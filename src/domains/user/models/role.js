import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const ROLES = ["user", "admin"];
const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  }
);

export default mongoose.models.Role || model("Role", roleSchema);