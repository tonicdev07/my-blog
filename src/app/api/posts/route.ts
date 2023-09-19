import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization");
  const url = new URL(req.url);
  const comment = url.searchParams.get("comment");
  const like = url.searchParams.get("like");
  const tag = url.searchParams.get("tag");

  const check =
    !accessToken ||
    !verifyJwt(accessToken as string) ||
    !process.env.SECRET_KEY;

  const whereCondition =
    tag && tag !== "undefined"
      ? { tags: { hasSome: [tag] } }
      : ({} as any);

  const posts = await prisma.post.findMany({
    where: whereCondition,
    select: {
      id: true,
      title: true,
      uploaded: true,
      images: {
        select: {
          id: true,
          imageUrl: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
      tags: true,
    },
  });

  const isOrderByComment = comment as string; // Using type assertion
  const isOrderByLike = like as string; // Using type assertion
  if (!check) {
    const decoded = verifyJwt(accessToken as string);

    const userId = decoded?.id;
    const postList = [];

    for (const post of posts) {
      const postId = post.id;

      const like = await prisma.postLike.findUnique({
        where: { userId_postId: { userId, postId } },
      });

      if (like) {
        const modifiedPost = {
          ...post,
          comments: post.comments.length,
          likes: null,
          likeCount: post.likes.length,
          likedByMe: true,
        };
        postList.push(modifiedPost);
      } else {
        const modifiedPost = {
          ...post,
          comments: post.comments.length,
          likes: null,
          likeCount: post.likes.length,
          likedByMe: null,
        };
        postList.push(modifiedPost);
      }
    }

    return new Response(
      JSON.stringify(
        postList.sort((a, b) => {
          if (isOrderByComment === "asc") {
            if (a.comments === b.comments) {
              return a.likeCount - b.likeCount;
            }
            return a.comments - b.comments;
          } else if (isOrderByComment === "desc") {
            if (a.comments === b.comments) {
              return b.likeCount - a.likeCount;
            }
            return b.comments - a.comments;
          } else if (isOrderByLike === "asc") {
            if (a.likeCount === b.likeCount) {
              return a.comments - b.comments;
            }
            return a.likeCount - b.likeCount;
          } else if (isOrderByLike === "desc") {
            if (a.likeCount === b.likeCount) {
              return b.comments - a.comments;
            }
            return b.likeCount - a.likeCount;
          } else {
            // Agar "asc" va "desc" dan boshqa biror qiymat kelsa, ishlatishni yo'qotish
            return 0;
          }
        })
      )
    );
  }

  const getPosts = posts
    .map((post) => ({
      ...post,
      comments: post.comments.length,
      likes: null,
      likeCount: post.likes.length,
      likedByMe: null,
    }))
    .sort((a, b) => {
      if (isOrderByComment === "asc") {
        if (a.comments === b.comments) {
          return a.likeCount - b.likeCount;
        }
        return a.comments - b.comments;
      } else if (isOrderByComment === "desc") {
        if (a.comments === b.comments) {
          return b.likeCount - a.likeCount;
        }
        return b.comments - a.comments;
      } else if (isOrderByLike === "asc") {
        if (a.likeCount === b.likeCount) {
          return a.comments - b.comments;
        }
        return a.likeCount - b.likeCount;
      } else if (isOrderByLike === "desc") {
        if (a.likeCount === b.likeCount) {
          return b.comments - a.comments;
        }
        return b.likeCount - a.likeCount;
      } else {
        // Agar "asc" va "desc" dan boshqa biror qiymat kelsa, ishlatishni yo'qotish
        return 0;
      }
    });

  return new Response(JSON.stringify(getPosts));
}
