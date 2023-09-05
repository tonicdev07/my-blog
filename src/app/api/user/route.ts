import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string; // username o'zgaruvchisini qo'shing
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const user = await prisma.user.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...result } = user;
  return new Response(JSON.stringify(result));
}