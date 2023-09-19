import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { utapi } from "uploadthing/server";

export async function POST(req: any) {
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

  const posts = await prisma.post.delete({
    where: { id: body.id },
  });

  if (posts.id) {
    await utapi.deleteFiles(body.urlKey);

    return new Response(JSON.stringify({ status: true }));
  }

  return new Response(JSON.stringify({ status: false }));
}
