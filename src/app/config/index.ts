import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
// const isProduction = process.env.NODE_ENV === 'production';

export default {
  port: process.env.PORT,
  // database_url: isProduction
  //   ? process.env.DATABASE_URL_CLOUD
  //   : process.env.DATABASE_URL_LOCAL,
  NODE_ENV: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL_CLOUD,
  environment: process.env.NODE_ENV,
  bcrypt_salt: process.env.BCRYPT_SALT,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_TOKEN_SECRET_EXPIRE,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret_local: process.env.STRIPE_WEB_HOOK_SECRET_LOCAL,
  stripe_webhook_secret_live: process.env.STRIPE_WEB_HOOK_SECRET_LIVE,
};
