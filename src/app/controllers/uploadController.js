import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = async (req, res) => {
    try{
        const uploadStream = cloudinary.uploader.upload_stream(
            {resource_type: 'image'},
            (error, result) => {
                if (error) {
                    return res.status(500).json({error: error.message});
                }
                return res.status(200).json({url: result.secure_url});
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export default uploadImage;