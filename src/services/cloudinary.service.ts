import { v2 as cloudinary } from 'cloudinary' 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async(image: string, email: string, folder: string) => {
    return await cloudinary.uploader.upload(image, {
        public_id: email,
        folder: folder
    });
}
