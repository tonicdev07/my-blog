import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("authorization");
  const url = new URL(req.url);

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

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      uploaded: true,
      body: true,
      images: {
        select: {
          id: true,
          imageUrl: true,
          imageKey: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      tags: true,
    },
  });

  return new Response(JSON.stringify(posts));
}
