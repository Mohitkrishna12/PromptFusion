"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import Card from "./Card";

const PromptCardList = ({ data, handleTagClick }: any) => {
  return (
    <div className="mt-16 prompt_layout">
      {data
        ?.sort((a:any, b:any) => a.prompt.localeCompare(b.prompt))
        .map((post: any) => {
          console.log(post)
          if (post.photo) {
            return <Card key={post._id} {...post} />;
          } else {
            return (
              <PromptCard
                key={post?._id}
                post={post}
                handleTagClick={handleTagClick}
              />
            );
          }
        })}
    </div>
  );
};

const RenderCards = ({ data, title }: any) => {
  if (data?.length > 0) {
    return data.map((post: any) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts]: Array<any> = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout]: any = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const imageResponse = await fetch("/api/ai-img");
    const imageData = await imageResponse.json();
    const promptResponse = await fetch("/api/prompt");
    const promptData = await promptResponse.json();

    setAllPosts((prev: any) => [...prev, ...imageData, ...promptData]);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log(allPosts);
  const filterPrompts = (searchtext: any) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts?.filter(
      (item: any) =>
        regex.test(item?.creator?.username) ||
        regex.test(item?.tag) ||
        regex.test(item?.prompt)
    );
  };

  const handleSearchChange = (e: any) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName: any) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
