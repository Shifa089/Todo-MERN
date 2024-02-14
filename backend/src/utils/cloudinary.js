import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilepath) => {
  try {
    if (!localFilepath) return null;
    const response = await cloudinary.uploader.upload(localFilepath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilepath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilepath);
    console.log("Failed to upload on cloudinary");
    return null;
  }
};

const deleteCloudinary = async (publicLink) => {
  try {
    if (!publicLink) return null;
    const response = await cloudinary.uploader.destroy(publicLink, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.log("Failed to delete on cloudinary Error",error?.message);
    return null;
  }
};

export { uploadCloudinary, deleteCloudinary };
