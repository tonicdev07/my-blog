'use client'
import Card from '@/components/userCard'
// Remember you must use an AuthProvider for 
// client components to useSession
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ClientPage() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

    // if (session?.user.role !== "admin"
    //     && session?.user.role !== "manager") {
    //     return <h1 className="text-5xl">Access Denied</h1>
    // }

    if (!session?.user) return

    return (
        <section className="flex flex-col gap-6">
            <Card user={session?.user} pagetype={"Client"} />
        </section>
    )
}