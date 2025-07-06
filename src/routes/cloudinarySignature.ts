import express from 'express';
import cloudinary from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/signature', (req, res) => {
  const publicId = uuidv4(); 
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      public_id: publicId,
      folder: 'audios',
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({
    signature,
    timestamp,
    publicId,
    folder: 'audios',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

export default router;
