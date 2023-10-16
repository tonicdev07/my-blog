"use client";

import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../services/comments";
import { CommentForm } from "./commentForm";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";
import { usePost } from "@/context/context";
import { useAsyncFn } from "@/hooks/useAsync";
import { IconBtn } from "./iconBtn";
import { CommentList } from "./commentList";
import Image from "next/image";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function Comment({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
}: {
  id: string;
  message: string;
  user: any;
  createdAt: string;
  likeCount: any;
  likedByMe: any;
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const postProps = usePost() as any;

  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 500);
  }, [id]);

  const {
    session,
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = postProps;

  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);
  const childComments = getReplies(id);
  const currentUser = useUser();

  function onCommentReply(message: string) {
    if (session.user.accessToken !== undefined) {
      return createCommentFn
        .execute({
          token: session.user.accessToken,
          postId: post.id,
          message,
          parentId: id,
        })
        .then((comment: any) => {
          setIsReplying(false);
          createLocalComment(comment);
        });
    }
  }

  function onCommentUpdate(message: string) {
    return updateCommentFn
      .execute({
        token: session.user.accessToken,
        postId: post.id,
        message,
        id,
      })
      .then((comment: any) => {
        setIsEditing(false);
        updateLocalComment(id, comment.message);
      });
  }

  function onCommentDelete() {
    setAnimation(false);
    return deleteCommentFn
      .execute({ postId: post.id, id, token: session?.user?.accessToken })
      .then((comment: any) => {
        deleteLocalComment(comment.id);
      });
  }

  function onToggleCommentLike() {
    return toggleCommentLikeFn
      .execute({ id, postId: post.id, token: session?.user?.accessToken })
      .then((data: any) => {
        toggleLocalCommentLike(id, data.addLike);
      });
  }

  return (
    <>
      <div
        className={` max-w-xl border rounded-md p-2 duration-500  ${
          animation
            ? " opacity-100 duration-700"
            : " ml-40 md:ml-96 duration-1000 "
        } `}
      >
        <div className="header flex justify-between md:flex-row sm:flex-col">
          <span className="flex items-center">
            <span className="mr-1">
              <Image
                src={user.image}
                className="rounded-full"
                alt={user.lastName}
                height={30}
                width={30}
              />
            </span>
            <span className="border flex px-1 rounded-sm dark:bg-slate-600  bg-yellow-50">
              {user.firstName + " " + user.lastName}
            </span>
          </span>
          <span className=" text-sm">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.error}
          />
        ) : (
          <div className="message break-all my-2">{message}</div>
        )}
        <div className="flex gap-1">
          <IconBtn
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "Unlike" : "Like"}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          {user.id === currentUser.id && (
            <>
              <IconBtn
                onClick={() => setIsEditing((prev) => !prev)}
                isActive={isEditing}
                Icon={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
              />
              <IconBtn
                disabled={deleteCommentFn.loading}
                onClick={onCommentDelete}
                Icon={FaTrash}
                aria-label="Delete"
                color="danger"
              />
            </>
          )}
        </div>
        {deleteCommentFn.error && (
          <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )}
      </div>
      {isReplying && (
        <div className={`mt-1 ml-3`}>
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack   ${
              areChildrenHidden
                ? " scale-0 absolute duration-500 "
                : " duration-500"
            }`}
          >
            <button
              className="collapse-line "
              // aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments ">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide " : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
}
