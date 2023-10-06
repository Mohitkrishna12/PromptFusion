import React from 'react'

const NoResultCard = ({searchText}:any) => {
  return (
    <div className="prompt_card mt-10 text-gray-200 text-center !py-5">
      No results found for '{searchText}'
    </div>
  );
}

export default NoResultCard