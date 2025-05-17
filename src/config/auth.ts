import dotenv from "dotenv";

dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_here",
  jwtExpire: process.env.JWT_EXPIRE || "30d",
};
