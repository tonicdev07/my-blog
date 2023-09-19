import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

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

  const getPost = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      body: true,
      title: true,
      images: {
        select: {
          id: true,
          imageUrl: true,
          imageKey: true,
        },
      },
      tags: true,
    },
  });

  return new Response(JSON.stringify(getPost));
}
