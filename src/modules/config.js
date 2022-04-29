import { config } from "dotenv";
config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET,
  DEFAULT_ROLE: "user",
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};