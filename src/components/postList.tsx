"use client";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { BsHeart, BsHeartFill, BsShare } from "react-icons/bs";
import { AiOutlineComment } from "react-icons/ai";
import { Courgette, Yeseva_One } from "next/font/google";
import { usePost } from "@/context/context";
import { AnyObject } from "antd/es/_util/type";
import { useAsyncFn } from "@/hooks/useAsync";
import { togglePostLike } from "@/services/comments";
import { useRouter } from "next/navigation";
import CustomImage from "./image";
import { makeRequest } from "@/services/makeRequest";

interface Post {
  id: string;
  images: { id: string; imageUrl: string }[];
  likeCount: number;
  likedByMe: boolean | null;
  title: string;
  uploaded: string;
  comments: string;
}

const roboto = Courgette({
  weight: "400",
  subsets: ["latin"],
});

const title = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
});

const PostList = () => {
  const toggleCommentLikeFn = useAsyncFn(togglePostLike);
  const { session, filter } = usePost() as any;
  const [postLike, setPostLike] = useState<Post[]>([]);

  const router = useRouter();
  function getPosts() {
    try {
      const data = makeRequest(
        `/api/posts?comment=${filter.filterComment}&like=${filter.filterLike}&tag=${filter.filterTag}`,
        {
          method: "GET",
          headers: {
            authorization: session?.user.accessToken,
          },
        }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  const {
    refetch,
    data: posts,
    isLoading: loading,
    error,
  } = useQuery({ queryKey: ["todos"], queryFn: getPosts });

  useEffect(() => {
    if (posts) {
      setPostLike(posts as any);
    }
    refetch();
  }, [posts, filter]);

  if (error) return <h1 className="error-msg">{error as string}</h1>;

  function toggleLocalPostLike(id: string, addLike: boolean) {
    setPostLike((prevPosts: AnyObject) => {
      return prevPosts.map((post: any) => {
        if (id === post.id) {
          const newLikeCount = addLike
            ? post.likeCount + 1
            : post.likeCount - 1;

          return {
            ...post,
            likeCount: newLikeCount,
            likedByMe: addLike,
          };
        } else {
          return post;
        }
      });
    });
  }

  const onToggleLike = (id: string) => {
    if (!session) return router.push("/login");
    if (session !== null) {
      return toggleCommentLikeFn
        .execute({ postId: id, token: session?.user?.accessToken })
        .then((data: { addLike: boolean }) => {
          toggleLocalPostLike(id, data.addLike);
        });
    }
  };

  function pushCheck(id: string) {
    if (!session) {
      return router.push("/login");
    } else {
      return router.push(`/post/${id}`);
    }
  }

  return (
    <div className="mt-20">
      {/* ===== box ====== */}
      {loading ? (
        <div className=" min-h-screen flex justify-center items-center">
          <div className="flex justify-center">
            <div className="spinner-container">
              <div className="spinner">
                <div className="spinner">
                  <div className="spinner">
                    <div className="spinner">
                      <div className="spinner">
                        <div className="spinner"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {postLike.map((post) => (
            <div key={post.id} className="box-effect max-w-[300px] border  p-2">
              <div
                className=" cursor-pointer"
                onClick={() => pushCheck(post.id)}
              >
                <div
                  className={`${title.className} px-2 mt-3 leading-6 text-xl h-[68px] font-semibold break-words dark:text-white text-black`}
                >
                  {post.title.slice(0, 63)}
                  <span className=" text-xs text-blue-500">yana..</span>
                </div>
                <div className={`${roboto.className} px-2 my-2 text-sm `}>
                  {(() => {
                    const date = new Date(post.uploaded);
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    const formattedDate = date.toLocaleDateString(
                      "en-US",
                      options as object
                    );
                    // Soat, daqiqa va soniyalarni olish
                    var hours = date.getHours().toString().padStart(2, "0");
                    var minutes = date.getMinutes().toString().padStart(2, "0");

                    return `${formattedDate} • ${hours + ":" + minutes}`;
                  })()}
                </div>
                <div className=" relative h-48">
                  {post.images[0].imageUrl ? (
                    <CustomImage product={post.images[0].imageUrl} fill />
                  ) : (
                    <>Loading</>
                  )}
                </div>
              </div>
              <div className="flex justify-around h-10 my-1 items-center">
                <div className="flex justify-center">
                  <div
                    onClick={() => onToggleLike(post.id)}
                    className="w-7 leading- h-7 flex  items-center justify-center"
                  >
                    {!post.likedByMe ? (
                      <BsHeart className="  font-semibold hover:text-red-600 text-lg hover:text-2xl duration-300  cursor-pointer  " />
                    ) : (
                      <BsHeartFill className="  font-semibold text-red-600 text-lg hover:text-2xl duration-300  cursor-pointer  " />
                    )}
                  </div>
                  <span className=" ">{post.likeCount}</span>
                </div>
                <div className="flex justify-center">
                  <div
                    onClick={() => pushCheck(post.id)}
                    className="w-9 h-7 flex  items-center justify-center"
                  >
                    <AiOutlineComment className=" w-10 font-semibold hover:text-green-600 text-2xl hover:text-3xl duration-300  cursor-pointer  " />
                  </div>
                  <span className=" leading-6">{post?.comments}</span>
                </div>
                <Link href={"#"}>
                  <BsShare className=" w-10 font-semibold hover:text-purple-700 text-lg hover:text-2xl duration-300  cursor-pointer  " />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
