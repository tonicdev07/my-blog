import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function POST(req: any, { params }: { params: { id: string } }) {
  const accessToken = req.headers.get("authorization");
  const body = await req.json();

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

  const posts = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      body: body.body,
      title: body.title,
      images: {
        update: {
          where: { id: body.imgId },
          data: {
            imageKey: body.imageKey,
            imageUrl: body.imageUrl,
          },
        },
      },
    },
  });

  if (posts.id) return new Response(JSON.stringify({ status: true }));

  return new Response(JSON.stringify({ status: false }));
}
