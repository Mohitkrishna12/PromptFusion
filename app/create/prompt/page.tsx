"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session }:any = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });

  const createPrompt = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagArray = post?.tag?.split(/[ ,]+/);
      console.log(tagArray)
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user?.id,
          tag: tagArray,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      title="Prompt"
      subTitle="Create and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform"
      submitting={submitting}
      handleSubmit={createPrompt}
    >
      <label>
        <span className="font-satoshi font-semibold text-base text-gray-400">
          Your AI Prompt
        </span>
        <textarea
          value={post.prompt}
          onChange={(e) => setPost({ ...post, prompt: e.target.value })}
          placeholder="Write your post here"
          required
          className="form_textarea "
        />
      </label>

      <label>
        <span className="font-satoshi font-semibold text-base text-gray-400">
          Field of Prompt{" "}
          <span className="font-normal">
            (Separate tags with spaces or commas e.g., #blockchain #dev
            or #product, #webdevelopment)
          </span>
        </span>
        <input
          value={post.tag}
          onChange={(e) => setPost({ ...post, tag: e.target.value })}
          type="text"
          placeholder="#Tag"
          required
          className="form_input"
        />
      </label>
    </Form>
  );
};

export default CreatePrompt;
