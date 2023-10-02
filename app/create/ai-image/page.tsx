"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Form from "@components/Form";
import Autosuggest from "react-autosuggest";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";

const CreatePost = () => {
  const [form, setForm] = useState({
    prompt: "",
    photo: "",
  });
  const router = useRouter();
  const { data: session }: any = useSession();
  const [submitting, setIsSubmitting] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [allPrompts, setAllPrompts] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false); 
  const [formError,setFormError] = useState(false);
  const inputRef = useRef(null);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPrompts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateImage = async () => {
    //api call to backend to get ai img
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        setFormError(false);
        const response = await fetch("/api/ai-image/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        console.log(response);
        const result = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${result?.photo}` });
        console.log(result);
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      setFormError(true);
      console.log("Please provide proper prompt");
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setIsSubmitting(true);
      setFormError(false);
      try {
        const response = await fetch("/api/ai-image/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...form, userId: session?.user?.id }),
        });
        await response.json();
        if(response.ok){
          router.push('/');
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormError(true);
      console.log("Please generate an image with proper details");
    }
  };
  console.log(form);

//to get random prompt from the prompt list
  const getRandomPrompt: any = (promt: string) => {
    const randomIndex = Math.floor(Math.random() * allPrompts.length);
    const randomPromt:any = allPrompts[randomIndex];
    return promt === randomPromt?.prompt ? getRandomPrompt(promt) : randomPromt?.prompt;
  };

  const handleSurpriseMe = () => {
    const getPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: getPrompt });
  };

  // Function to handle selecting an item from the search results
  const handleSelectItem = (item: any) => {
    setForm({ ...form,prompt:item?.prompt}); // Set the search input field to the selected item
    setSuggestionsVisible(false);
  };


  // Function to get matching prompts or tags based on user input
  const getSuggestions = (value: any) => {
    const inputValue = value?.trim()?.toLowerCase();
    const inputLength = inputValue?.length;
    return inputLength === 0
      ? allPrompts
      : allPrompts?.filter(
          (item: any) =>
            item?.prompt?.toLowerCase()?.includes(inputValue) ||
            item?.tag?.some((tag: any) =>
              tag?.toLowerCase()?.includes(inputValue)
            )
        );
  };
  console.log(form)

  return (
    <Form
      type="Create"
      title="Ai-Image"
      subTitle="Generate an imaginative AI image with the help of prompts and share it
          with the community"
      submitting={submitting}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 ">
          <label
            htmlFor="Prompt"
            className="font-satoshi font-semibold text-base text-gray-400"
          >
            Prompt
          </label>
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="font-semibold text-xs bg-[#6469ff] py-1 px-2 rounded-[5px] text-white"
          >
            Surprise me
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for prompts or tags"
            value={form?.prompt}
            required
            onChange={(e) => {
              setForm({ ...form, prompt: e.target.value });
              setSuggestionsVisible(true); // Show suggestions on input change
            }}
            onFocus={() => setSuggestionsVisible(true)} // Show suggestions on input focus
            onBlur={() => {
              setTimeout(() => {
                setSuggestionsVisible(false);
              }, 200);
            }} // Hide suggestions on input blur
            ref={inputRef}
            className="form_input !mt-0"
          />
          {suggestionsVisible && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 shadow-lg py-1 z-10">
              {getSuggestions(form?.prompt).map((item: any, index) => (
                <div
                  key={index}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelectItem(item)}
                >
                  {item?.prompt}{" "}
                  <span className="text-green-500">{item?.tag?.join(" ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
          {form.photo ? (
            <img
              src={form.photo}
              alt={form.prompt}
              className="w-full h-full object-contain"
            />
          ) : (
            <Image
              src="/assets/images/preview.png"
              alt="preview"
              className="object-contain opacity-40"
              width={500}
              height={500}
            />
          )}

          {generatingImg && (
            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
            </div>
          )}
        </div>
        {formError && <span className="text-red-500">**Please generate an Ai-Image with prompt</span>}
      </div>

      <div className="flex gap-5">
        <button
          type="button"
          onClick={generateImage}
          className=" text-white bg-orange-600 rounded-full font-semibold text-sm  sm:w-auto px-5 py-1.5 text-center"
        >
          {generatingImg ? "Generating..." : "Generate"}
        </button>
      </div>
    </Form>
  );
};

export default CreatePost;
