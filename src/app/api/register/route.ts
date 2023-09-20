import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  image: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();
  if (!body.image) {
  }
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        username: body.username,
        image: body.image ? body.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfIG1adz2cC3T6BaBzktqNU14KdRP0psfugw&usqp=CAU",
        password: await bcrypt.hash(body.password, 10),
      },
    });

  const { password, ...result } = user;
  return new Response(JSON.stringify(result));
}
