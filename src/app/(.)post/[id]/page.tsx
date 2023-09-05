"use client";

import { CommentForm } from "@/components/commentForm";
import { CommentList } from "@/components/commentList";
import { usePost } from "@/context/context";
import { useAsyncFn } from "@/hooks/useAsync";
import { createComment } from "@/services/comments";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Courgette } from "next/font/google";
const roboto = Courgette({
  weight: "400",
  subsets: ["latin"],
});

export default function Post() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { session, loadingPage, post, rootComments, createLocalComment } =
    usePost();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn(createComment);

  function onCommentCreate(message: string) {
    return createCommentFn({
      postId: post.id,
      message,
      token: session?.user?.accessToken,
    }).then(createLocalComment);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        router.back();
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-[#2955a67d]" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel
            className={
              "mx-auto max-w-5xl rounded-xl border dark:border-white dark:bg-[#1c1f26] bg-[#dcd4d4f7] p-3 md:p-10"
            }
          >
            {loadingPage ? (
              <div className="h-8 w-8 rounded-full border-2 border-dotted border-blue-600 animate-spin" />
            ) : (
              <div className=" mx-auto">
                <div
                  className={`${roboto.className}  flex justify-end mb-4 text-sm `}
                >
                  {(() => {
                    const date = new Date(post.uploaded);
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    };
                    const formattedDate = date.toLocaleDateString(
                      "en-US",
                      options as any
                    );
                    // Soat, daqiqa va soniyalarni olish
                    var hours = date.getHours().toString().padStart(2, "0");
                    var minutes = date.getMinutes().toString().padStart(2, "0");

                    return (
                      <span>
                        {formattedDate} • {hours + ":" + minutes}
                      </span>
                    );
                  })()}
                </div>
                <h1 className=" text-xl md:text-4xl font-semibold">
                  {post.title}
                </h1>
                <article className="my-4 border-l-2 border-green-600 pl-3 text-sm md:text-lg leading-6">
                  {post.body}
                </article>
                <div className="flex gap-2 mb-2 border-b pb-1 border-blue-700">
                  {post?.tags?.map((i: any) => (
                    <Link
                      href={"#"}
                      key={i.id}
                      className="py-[2px] px-2 rounded-lg bg-[#e3e3e3] dark:bg-[#28344d]"
                    >
                      <span className=" text-sm ">#{i.name}</span>
                    </Link>
                  ))}
                </div>

                <div className=" ">
                  {post?.images?.map((i) => (
                    <div key={i.id}>
                      <Image
                        src={i.imageUrl}
                        alt={i.id}
                        className=" rounded-xl "
                        height={200}
                        width={200}
                      />
                    </div>
                  ))}
                </div>
                <section className="  flex justify-center items-center ">
                  <div className=" w-full">
                    <h3 className="comments-title mb-2 mt-6">Comments</h3>
                    <CommentForm
                      loading={loading}
                      error={error}
                      onSubmit={onCommentCreate}
                    />

                    {rootComments != null && rootComments.length > 0 && (
                      <div className="mt-4">
                        <CommentList comments={rootComments} />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
