import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  message: string;
  parentId: string;
  postId: string;
}

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const accessToken = req.headers.get("authorization");

  if (!accessToken || !verifyJwt(accessToken) || !process.env.SECRET_KEY) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }
  const decoded = verifyJwt(accessToken);

  const data = {
    commentId: params.commentId,
    userId: decoded?.id,
  };

  const like = await prisma.commentLike.findUnique({
    where: { userId_commentId: data },
  });


  if (like == null) {
    const res = await prisma.commentLike.create({ data }).then(() => {
      return { addLike: true };
    });
    return new Response(JSON.stringify(res));
  } else {
    const res = await prisma.commentLike
      .delete({ where: { userId_commentId: data } })
      .then(() => {
        return { addLike: false };
      });
    return new Response(JSON.stringify(res));
  }
}
