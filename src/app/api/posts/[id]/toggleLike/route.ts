import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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
    postId: params.id,
    userId: decoded?.id,
  };

  const like = await prisma.postLike.findUnique({
    where: { userId_postId: data },
  });


  if (like == null) {
    const res = await prisma.postLike.create({ data }).then(() => {      
      return { addLike: true };
    });
    return new Response(JSON.stringify(res));
  } else {
    const res = await prisma.postLike
      .delete({ where: { userId_postId: data } })
      .then(() => {
        return { addLike: false };
      });
    return new Response(JSON.stringify(res));
  }
}
