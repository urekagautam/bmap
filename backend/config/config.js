import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 5005,
    dbUri: String(process.env.DB_URI),

    accessTokenKey: String(process.env.ACCESS_TOKEN_KEY),
    accessTokenExpiry: String(process.env.ACCESS_TOKEN_EXPIRY),
    refreshTokenKey: String(process.env.REFRESH_TOKEN_KEY),
    REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY),
};