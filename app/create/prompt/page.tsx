"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session, status }: any = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [tags, setTags]:any = useState([]); 
  const [inputValue, setInputValue] = useState("");

  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

   const handleInputChange = (e:any) => {
     const value = e.target.value;
     // Use a regular expression to remove special characters
     const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
     setInputValue(sanitizedValue);
   };

   const handleInputKeyPress = (e:any) => {
    e.preventDefault();
     if (e.keyCode === 32) {
       // Add the tag to the list when the user presses Space
       const newTag = '#'+inputValue.trim();
       if (newTag && newTag.length>1) {
         setTags([...tags, newTag]);
         setInputValue("");
       }
     }
   };

   const handleTagClick = (index:number) => {
     // Remove the tag when clicked
     const updatedTags = tags?.filter((t: any,i:number) => i !== index);
     setTags(updatedTags);
   };

  const createPrompt = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user?.id,
          tag: tags,
        }),
      });

      if (response.ok) {
        router.push("/prompt");
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
      <div className="flex flex-wrap">
        {tags.map((tag: any,index:number) => (
          <div
            key={index}
            className="font-inter text-base font-bold green_gradient px-2 py-1 hover:text-gray-200 cursor-pointer transition duration-200"
            onClick={() => handleTagClick(index)}
          >
            {tag}
          </div>
        ))}
      </div>
      <label>
        <span className="font-satoshi font-semibold text-base text-gray-400">
          Field of Prompt{" "}
          <span className="font-normal">
            (Hit Space to add tag and click the tag to remove)
          </span>
        </span>
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyUp={handleInputKeyPress}
          type="text"
          placeholder="#Tags"
          required={tags.length < 1}
          className="form_input"
        />
      </label>
    </Form>
  );
};

export default CreatePrompt;
