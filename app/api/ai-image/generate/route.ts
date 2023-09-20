import { connectToDB } from "@utils/database";
import OpenAI from "openai/index.mjs";

const openai:any = new OpenAI(process.env.OPENAI_API_KEY as any);

export const POST = async (request:any) => {
  const { prompt } = await request.json();
  console.log(prompt)
  try {
    await connectToDB();
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse?.data?.[0]?.b64_json;
    return new Response(JSON.stringify({photo:image}), { status: 201 });
  } catch (error) {
    console.log(error)
    return new Response("Failed to generate a ai image", { status: 500 });
  }
};
