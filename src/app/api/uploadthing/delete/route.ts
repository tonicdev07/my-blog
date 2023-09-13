import { utapi } from "uploadthing/server";

interface RequestBody {
  urlKey: string;
}

export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const response = await utapi.deleteFiles(body.urlKey);

  return new Response(JSON.stringify(response));
}
