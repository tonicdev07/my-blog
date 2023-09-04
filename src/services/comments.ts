import { makeRequest } from "./makeRequest";

export function createComment({
  token,
  postId,
  message,
  parentId,
}: {
  postId: any;
  id: any;
  message: any;
  token: any;
  parentId: any;
}) {
  return makeRequest(`/api/posts/${postId}/comments`, {
    method: "POST",
    data: { message, parentId },
    headers: {
      authorization: token,
    },
  });
}

export function updateComment({
  postId,
  message,
  id,
  token,
}: {
  postId: any;
  id: any;
  message: any;
  token: any;
}) {
  return makeRequest(`/api/posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { message },
    headers: {
      authorization: token,
    },
  });
}

export function deleteComment({
  postId,
  id,
  token,
}: {
  postId: any;
  token: any;
  id: any;
}) {
  return makeRequest(`/api/posts/${postId}/comments/${id}`, {
    method: "DELETE",
    headers: {
      authorization: token,
    },
  });
}

export function toggleCommentLike({
  id,
  postId,
  token,
}: {
  postId: any;
  token: any;
  id: any;
}) {
  return makeRequest(`/api/posts/${postId}/comments/${id}/toggleLike`, {
    method: "POST",
    headers: {
      authorization: token,
    },
  });
}
export function togglePostLike({ postId, token }: { postId: any; token: any }) {
  return makeRequest(`/api/posts/${postId}/toggleLike`, {
    method: "POST",
    headers: {
      authorization: token,
    },
  });
}
export function getPostData(token: string) {
  return makeRequest(`/api/posts`, {
    method: "GET",
    headers: {
      authorization: token,
    },
  });
}
