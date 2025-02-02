import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  environment: process.env.NODE_ENV,
  bcrypt_salt: process.env.BCRYPT_SALT,
  NODE_ENV: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_TOKEN_SECRET_EXPIRE,
  cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEB_HOOK_SECRET,
};
