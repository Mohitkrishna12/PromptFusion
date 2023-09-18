import Feed from '@components/Feed';
import React from 'react'

const page = ({params}:any) => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover & Share
        <br className="max-md:hidden" />
        <span className="green_gradient text-center">
          {" "}
          AI-Powered Images & Prompts
        </span>
      </h1>
      <p className="desc text-center">
        PromptFusion is an open-source AI prompting tool to Inspire, Create, and
        Share Unique Prompts, Transforming Ideas into AI-Generated Art!
      </p>

      <Feed page={params?.slug}/>
    </section>
  );
}

export default page