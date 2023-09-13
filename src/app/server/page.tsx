import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
// import UserCard from "../components/UserCard"
import { redirect } from "next/navigation"

export default async function ServerPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/server')
    }

    return (
        <section className="flex flex-col gap-6">
            server
            {/* <UserCard user={session?.user} pagetype={"Server"} /> */}
        </section>
    )

}