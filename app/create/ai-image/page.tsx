"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Form from "@components/Form";
import Autosuggest from "react-autosuggest";

const CreatePost = () => {
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
    userId: "65082b002504d81169d1ab4e",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPrompts, setAllPrompts] = useState([]);

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
    const getPrompt = "";
    //getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: getPrompt });
  };
  const generateImage = async () => {
    //api call to backend to get ai img
    if (form.prompt) {
      try {
        setGeneratingImg(true);
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

  const [searchValue, setSearchValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false); // Control visibility of suggestions
  const submitting = false; //
  const inputRef = useRef(null);

  // Function to handle selecting an item from the search results
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setSearchValue(item?.prompt); // Set the search input field to the selected item
    setSuggestionsVisible(false);
  };

  // Function to handle form submission

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
  console.log(searchValue)

  return (
    <Form
      type="Create"
      title="Ai-Image"
      subTitle="Generate an imaginative AI image with the help of prompts and share it
          with the community"
      post={form}
      // setPost={setPost}
      // submitting={submitting}
      // handleSubmit={createPrompt}
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
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
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
              {getSuggestions(searchValue).map((item: any, index) => (
                <div
                  key={index}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelectItem(item)}
                >
                  {item?.prompt}{" "}
                  <span className="text-green-500">
                    {item?.tag?.join(" ")}
                  </span>
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
    </Form>
  );
};

export default CreatePost;
