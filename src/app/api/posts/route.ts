import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

export async function GET(req: Request) {
  const params = req.url;

  const accessToken = req.headers.get("authorization");

  const check =
    !accessToken ||
    !verifyJwt(accessToken as string) ||
    !process.env.SECRET_KEY;
  const whereCondition = params ? { tags: { some: { name: params } } } : {};
  const posts = await prisma.post.findMany({
    // where: whereCondition,
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
          id: true,
        },
      },
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

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
          likeCount: post.likes.length,
          likedByMe: true,
        };
        postList.push(modifiedPost);
      } else {
        const modifiedPost = {
          ...post,
          likeCount: post.likes.length,
          likedByMe: null,
        };
        postList.push(modifiedPost);
      }
    }
    return new Response(JSON.stringify(postList));
  }

  const getPosts = posts.map((post) => ({
    ...post,
    likeCount: post.likes.length,
    likedByMe: null,
  }));

  return new Response(JSON.stringify(getPosts));
}
