"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import Card from "./Card";

const PromptImageList = ({ data, handleTagClick }: any) => {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 mt-16">
      {data
        ?.map((post: any) => {
          if (post?.photo) {
            return <Card key={post._id} {...post} />;
          } 
        })}
    </div>
  );
};

const PromptCardList = ({ data, handleTagClick }: any) => {
  return (
    <div className="mt-16 prompt_layout">
      {data?.map((post: any) => {
        if (!post?.photo) {
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


const Feed = ({page}:any) => {
  const [allPosts, setAllPosts]: Array<any> = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout]: any = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/"+page);
    const data = await response.json();
    setAllPosts(data);
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
    <section className="feed mb-16">
      <form className="relative w-full max-w-xl flex-center">
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
        page === "prompt" && <PromptCardList data={allPosts} handleTagClick={handleTagClick} /> ||
        page === "ai-image" && <PromptImageList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
