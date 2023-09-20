"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import  FormField from "@components/FormField";

const CreatePost = () => {

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: '',
    userId: "65082b002504d81169d1ab4e",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPrompts,setAllPrompts] = useState([]);

   const fetchPosts = async () => {
     const response = await fetch("/api/prompt");
     const data = await response.json();
     setAllPrompts(data);
   };

   useEffect(() => {
     fetchPosts();
   }, []);


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const getPrompt = ""
    //getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: getPrompt });
  };
  const generateImage = async () => {
    //api call to backend to get ai img
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "/api/ai-image/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );
        console.log(response);
        const result = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${result?.photo}` });
        console.log(result);
      } catch (err) {
        console.log(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("/api/ai-image/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form }),
        });
        await response.json();
        console.log(response);
        //alert("Success");
        //navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };
  console.log(form);
  return (
    <section className="w-full max-w-full flex-start flex-col mb-16">
      <h1 className="head_text text-left">
        <span className="green_gradient">Create Ai-Image</span>
      </h1>
      <p className="desc text-left max-w-md">
        Generate an imaginative AI image with the help of prompts and share it with the
        community
      </p>

      <form
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="select"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

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
                {/* <Loader /> */}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-5">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
