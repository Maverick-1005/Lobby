import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import {auth} from "@clerk/nextjs/server"


const handleAuth = async () => {
   const {userId} = await auth();

   if(!userId) throw new Error("Unauthorized")
   return {userId}

}

export async function POST(req: NextRequest) {
  try {
    // const { userId } = await handleAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload file to Cloudinary
    const fileUrl = await uploadOnCloudinary(fileBuffer, file.type);

    if (!fileUrl) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
