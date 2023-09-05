import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = req.headers.get("authorization");

  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }
  const decoded = verifyJwt(accessToken as string);

  const COMMENT_SELECT_FIELDS = {
    id: true,
    message: true,
    parentId: true,
    createdAt: true,
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    },
  };

  const getPost = await prisma.post
    .findUnique({
      where: { id: params.id },
      select: {
        body: true,
        title: true,
        uploaded: true,
        likes: { select: { id: true } },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            likes: { select: { id: true } },
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .then(async (post: any) => {
      const postId = params.id;
      const userId = decoded?.id;

      const comLikes = await prisma.commentLike.findMany({
        where: {
          userId: userId,
          commentId: { in: post.comments.map((comment: any) => comment.id) },
        },
      });

      const postLike = await prisma.postLike.findUnique({
        where: { userId_postId: { userId, postId } },
      });
      return {
        ...post,
        comments: post.comments.map((comment: any) => {
          const { likes, ...commentFields } = comment;
          return {
            ...commentFields,
            likedByMe: comLikes.find((like) => like.commentId === comment.id),
            likeCount: likes.length,
          };
        }),
        like: {
          likedByMe: postLike?.userId === userId,
          likeCount: post?.likes.length,
        },
      };
    });    

  return new Response(JSON.stringify(getPost));
}
