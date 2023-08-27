import Post from "@models/post";
import { connectToDB } from "@utils/database";
import { v2 as cloudinary } from "cloudinary";


export const GET = async (request: any) => {
  try {
    await connectToDB();

    const prompts = await Post.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all posts", { status: 500 });
  }
};


