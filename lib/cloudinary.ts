import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary = async (fileBuffer: Buffer, mimeType: string): Promise<string | null> => {
    try {
      if (!fileBuffer) return null;
  
      // Convert buffer to base64
      const fileBase64 = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "uploads",
        resource_type: "auto",
      });
  
      return result.secure_url; // Return the Cloudinary file URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };
export {uploadOnCloudinary};