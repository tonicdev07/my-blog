
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { handler } from "../api/auth/[...nextauth]/route";
import Card from "@/components/userCard";

export default async function ServerPage() {
  const session = await getServerSession(handler);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  return (
    <section className="flex flex-col gap-6">
      <Card user={session?.user} pagetype={"Server"} />
    </section>
  );
}
