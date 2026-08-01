import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: (process.env.PORT as string) || ("5000" as string),
  database_url: process.env.DATABASE_URL as string,
  app_url: process.env.APP_URL as string,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  stripe_product_id: process.env.STRIP_PRODUCT_ID as string,
  stripe_product_price_id: process.env.STRIP_PRODUCT_PRICE_ID as string,
  stripe_secret_api_key: process.env.STRIPE_SECRET_API_KEY as string,
  stripe_webhook_secret: process.env.STRIPE_ENDPOINT_SECRET as string,
};
