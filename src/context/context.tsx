"use client";

import { makeRequest } from "@/services/makeRequest";
import axios from "axios";
import { useParams } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  createContext,
} from "react";
import { useQuery } from "react-query";

const Context = createContext({});

export function usePost() {
  return useContext(Context);
}

export function PostProvider({
  children,
  session,
}: {
  children: any;
  session: any;
}) {
  const { id } = useParams();
  async function getPosts(): Promise<any> {
    try {
      const url = `/api/posts/${id}`;
      const data = await makeRequest(url, {
        method: "GET",
        headers: {
          authorization: session?.user.accessToken,
        },
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  const {
    refetch,
    data: post,
    isLoading: loadingPage,
    error,
  } = useQuery({ queryKey: ["post"], queryFn: getPosts, enabled: false });

  const [comments, setComments] = useState<string[]>([]);

  const commentsByParentId = useMemo(() => {
    const group: any = {};
    comments.forEach((comment: any) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (id !== undefined) {
      refetch();
    }
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [id, post?.comments]);

  function getReplies(parentId: string) {
    return commentsByParentId[parentId];
  }

  function createLocalComment(comment: string) {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  }

  function updateLocalComment(id: string, message: string) {
    setComments((prevComments: any) => {
      return prevComments.map((comment: any) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  }

  function deleteLocalComment(id: string) {
    refetch();
  }

  function toggleLocalCommentLike(id: string, addLike: boolean) {
    setComments((prevComments) => {
      return prevComments.map((comment: any) => {
        if (id === comment.id) {
          if (addLike) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...comment,
              likeCount: comment.likeCount - 1,
              likedByMe: false,
            };
          }
        } else {
          return comment;
        }
      });
    });
  }

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        rootComments: commentsByParentId["null"],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
        loadingPage,
        error,
        session,
      }}
    >
      {children}
    </Context.Provider>
  );
}
