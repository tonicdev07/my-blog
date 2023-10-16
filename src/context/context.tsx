"use client";

import { makeRequest } from "@/services/makeRequest";
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

interface filterType {
  filterLike: String;
  filterComment: String;
  filterTag: String;
}

export function PostProvider({
  children,
  session,
}: {
  children: any;
  session: any;
}) {
  const { id } = useParams();
 
  const {
    refetch,
    data: post,
    isFetching: loadingPage,
    error,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      try {
        const url = `/api/posts/${id}`;
        const data = await makeRequest(url, {
          method: "GET",
          headers: {
            authorization: session.user.accessToken,
          },
        });
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!id,
  });

  const [comments, setComments] = useState<string[]>([]);
  const [filter, setFilter] = useState<filterType>({
    filterComment: "",
    filterLike: "",
    filterTag: "",
  });
  
  const commentsByParentId = useMemo(() => {
    const group: any = {};
    comments.forEach((comment: any) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

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
        filter,
        setFilter,
      }}
    >
      {children}
    </Context.Provider>
  );
}
