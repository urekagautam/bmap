import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5005,
  dbUri: String(process.env.DB_URI),

  accessTokenKey: String(process.env.ACCESS_TOKEN_KEY),
  refreshTokenKey: String(process.env.REFRESH_TOKEN_KEY),

  accessTokenExpiry:
    Number(process.env.ACCESS_TOKEN_EXPIRY) || 7 * 24 * 60 * 60,
  refreshTokenExpiry:
    Number(process.env.REFRESH_TOKEN_EXPIRY) || 7 * 24 * 60 * 60,
};
