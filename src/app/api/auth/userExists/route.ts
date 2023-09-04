import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  email: string;
}
export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if (user) {
    const { password, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);
    const result = {
      ...userWithoutPass,
      isCheck: true,
      accessToken,
    };
    return new Response(JSON.stringify(result));
  } else {
    const data = {
      isCheck: false,
      user: null,
    };
    return new Response(JSON.stringify(data));
  }
}
