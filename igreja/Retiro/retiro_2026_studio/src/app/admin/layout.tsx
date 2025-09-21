import Link from "next/link"
import { Bell, Home, Users, Church, BarChart, LogOut } from "lucide-react"
import { redirect } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Firebase Auth state is managed client-side.
  // For server components, we typically check auth via cookies or tokens.
  // However, for simplicity and to avoid complex server-side Firebase Admin SDK setup for this example,
  // we'll rely on client-side redirects handled by the login page and middleware.
  // The middleware will handle the initial redirect if not authenticated.
  // This component will just render the layout.

  // To ensure the layout only renders for authenticated users, we can add a client-side check
  // or rely on the middleware to redirect. For a server component, a direct check is harder
  // without Firebase Admin SDK or a custom API route to verify session.
  // For now, we'll assume middleware handles the initial protection.

  // If you need server-side rendering based on auth, you'd use Firebase Admin SDK
  // to verify ID tokens from cookies.

  // For this example, we'll remove the direct session check here and rely on middleware.
  // The middleware will redirect unauthenticated users.

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Church className="h-6 w-6" />
              <span className="">Retiro Maranata Admin</span>
            </Link>
            <form action="/auth/sign-out" method="post" className="ml-auto">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </form>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <BarChart className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/registrations"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Inscrições
              </Link>
              <Link
                href="/admin/churches"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Church className="h-4 w-4" />
                Igrejas
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}