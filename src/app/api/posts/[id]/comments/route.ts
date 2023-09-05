import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  message: string;
  parentId: string;
  postId: string;
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = req.headers.get("authorization");
  const body: RequestBody = await req.json();

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
  const createComment = await prisma.comment
    .create({
      data: {
        message: body.message,
        userId: decoded?.id,
        parentId: body.parentId,
        postId: params.id,
      },
      select: {
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
      },
    })
    .then((comment) => {
      return {
        ...comment,
        likeCount: 0,
        likedByMe: false,
      };
    });

  return new Response(JSON.stringify(createComment));
}

