import { signJwtAccessToken, verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

interface RequestBody {
  body: string;
  title: string;
  imageUrl: string;
  tags: [{ name: string }];
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

  const tags = body.tags.map(tag => ({ name: tag.name }));

  const existingTags = await prisma.tag.findMany({
    where: { OR: tags },
    select: { id: true },
  });
  
  const tagsToConnect = existingTags.map(tag => ({ id: tag.id }));
  
  const createNewTags = tags.filter(newTag => {
    return !existingTags.some(existingTag => existingTag.id === newTag.id);
  });
  
  const createPost = await prisma.post
    .create({
      data: {
        body: body.body,
        title: body.title,
        tags: {
          connect: tagsToConnect,
          create: createNewTags,
        },
        images: {
          create: {
            imageUrl: body.imageUrl,
          },
        },
      },
      select: {
        id: true,
        comments: {
          select: {
            id: true,
            createdAt: true,
            message: true,
            parentId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
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
