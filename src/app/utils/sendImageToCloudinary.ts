import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import fs from 'fs';

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  const profileImg = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })

    .catch((error) => {
      console.info(error);
    });

  fs.unlink(path, (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('File deleted successfully');
  });

  return profileImg;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
