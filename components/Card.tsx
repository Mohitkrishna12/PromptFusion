import React from "react";
import Image from "next/image";
import FileSaver from "file-saver";

const downloadImage = async (id: any, photo: any) => {
  FileSaver.saveAs(photo, `download-${id}.jpg`);
};

const Card = ({ _id, prompt, photo, creator }: any) => (
  <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
    <img
      className="w-full h-auto object-cover rounded-xl"
      src={photo}
      alt={prompt}
    />
    <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
      <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

      <div className="mt-5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {/* <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold"> */}
            <Image
              src={creator?.image}
              alt="user_image"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          {/* </div> */}
          <p className="text-white text-sm">{creator?.username}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadImage(_id, photo)}
          className="outline-none bg-transparent border-none"
        >
          <Image
            src={"/assets/images/download.png"}
            alt={"copy_icon"}
            width={15}
            height={15}
            className="invert"
          />
        </button>
      </div>
    </div>
  </div>
);

export default Card;
