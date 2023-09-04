import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: number } }) {
  const accessToken = request.headers.get("authorization");
  
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
  const userId: string = String(params.id); // Convert params.id to string

  const getUser = await prisma.user.findMany({
    where: { id: userId },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });


  return new Response(JSON.stringify(getUser));
}