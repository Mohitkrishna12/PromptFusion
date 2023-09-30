import Post from "@models/post";
import { connectToDB } from "@utils/database";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request: any) => {
  const { userId, prompt,name,photo } = await request.json();
  try {
    await connectToDB();
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPrompt = new Post({ creator: userId, prompt,photo:photoUrl.url });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new Post", { status: 500 });
  }
};