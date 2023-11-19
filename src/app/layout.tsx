export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/providers/next-theme-provider'
import { DM_Sans } from 'next/font/google'

import './globals.css'
import { cn, constructMetadata } from '@/lib/utils'
import AppStateProvider from '@/lib/providers/state-provider'
import { SupabaseUserProvider } from '@/lib/providers/supabase-user-provider'
import { Toaster } from '@/components/ui/toaster'
import { SocketProvider } from '@/lib/providers/socket-provider'

const inter = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn('bg-background', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppStateProvider>
            <SupabaseUserProvider>
              <SocketProvider>
                {children}
                <Toaster />
              </SocketProvider>
            </SupabaseUserProvider>
          </AppStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
