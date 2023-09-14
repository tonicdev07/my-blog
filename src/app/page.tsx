import CustomMenu from "@/components/Menu";
import PostList from "@/components/postList";
import React from "react";

export default async function Home() {
  return (
    <div className="grid grid-cols-1 justify-items-center ">
      <div className=" col-end-1">
        <CustomMenu />
      </div>
      <div className=" mx-auto  min-h-screen max-w-5xl px-3 md:px-2 ">
          <PostList />
      </div>
    </div>
  );
}
