import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  message: string;
  parentId: string;
  postId: string;
}

export async function PUT(
  req: Request,
  { params }: { params: { commentId: string } }
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

  if (body.message === "" || body.message == null) {
    return new Response("Message is required!");
  }

  const { userId } = await prisma.comment.findUnique({
    where: { id: params.commentId },
    select: { userId: true },
  })as any;

  if (userId !== decoded?.id) {
    return new Response("You do not have permission to edit this message");
  }

  const updateComment = await prisma.comment.update({
    where: { id: params.commentId },
    data: { message: body.message },
    select: { message: true },
  });

  return new Response(JSON.stringify(updateComment));
}

export async function DELETE(
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

  const { userId } = await prisma.comment.findUnique({
    where: { id: params.commentId },
    select: { userId: true },
  })as any;

  if (userId !== decoded?.id) {
    return new Response(
      JSON.stringify("You do not have permission to delete this message")
    );
  }

  const res = await prisma.comment.delete({
    where: { id: params.commentId },
    select: { id: true },
  });

  return new Response(JSON.stringify(res));
}
