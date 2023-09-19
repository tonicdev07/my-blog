import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  body: string;
  title: string;
  imageUrl: string;
  imageKey: string;
  tags: [];
}

export async function POST(req: Request) {
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

  const tags = body.tags.map((tag) => ({ name: tag })) as any;

  // const existingTags = await prisma.tag.findMany({
  //   where: { OR: tags },
  //   select: { id: true, name: true },
  // });

  const postName = await prisma.post.findMany({
    where: { title: body.title },
    select: { title: true },
  });

  if (postName.length !== 0)
    return new Response(
      JSON.stringify({
        error: "Nom mavjud",
        check: false,
      }),
      {
        status: 404,
      }
    );

  // const tagsToConnect = existingTags.map((tag) => ({ id: tag.id }));

  // const createNewTags = tags.filter((newTag: any) => {
  //   return !existingTags.some(
  //     (existingTag: any) => existingTag.name === newTag.name
  //   );
  // });

  const createPost = await prisma.post
    .create({
      data: {
        body: body.body,
        title: body.title,
        tags: body.tags,
        images: {
          create: {
            imageUrl: body.imageUrl,
            imageKey: body.imageKey,
          },
        },
      },
    })
    .then((post) => {
      return {
        ...post,
        likeCount: 0,
        likedByMe: false,
      };
    });

  return new Response(JSON.stringify(createPost));
}
