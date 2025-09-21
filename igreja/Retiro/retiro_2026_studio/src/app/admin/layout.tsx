import Link from "next/link"
import { Bell, Home, Users, Church, BarChart, LogOut } from "lucide-react"
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

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
