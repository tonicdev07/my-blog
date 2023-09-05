"use client"

import { CommentForm } from "@/components/commentForm"
import { CommentList } from "@/components/commentList"
import { usePost } from "@/context/context"
import { useAsyncFn } from "@/hooks/useAsync"
import { createComment } from "@/services/comments"


export default function Post() {
  const { post, rootComments, createLocalComment } = usePost() as any
  const { loading, error, execute: createCommentFn } = useAsyncFn(createComment)

  function onCommentCreate(message: any) {
    return createCommentFn({ postId: post.id, message }).then(
      createLocalComment
    )
  }

  return (
    <div className=" max-w-sm mx-auto my-4">
      <h1>{post.title}</h1>
      <article>{post.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
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
      </section>
    </div>
  )
}