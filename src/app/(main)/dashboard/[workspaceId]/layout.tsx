import MobileSidebar from '@/components/sidebar/MobileSidebar'
import Sidebar from '@/components/sidebar/Sidebar'
import { SubscriptionModalProvider } from '@/lib/providers/SubscriptionModalProvider'
import { getActiveProductsWithPrice } from '@/lib/supabase/queries'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  params: { workspaceId: string }
}

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <Sidebar params={params} />
      <MobileSidebar>
        <Sidebar params={params} className="w-screen inline-block sm:hidden" />
      </MobileSidebar>
      <div className="dark:border-Neutrals-12/70 border-l-[1px] w-full relative overflow-scroll">
        {children}
      </div>
    </main>
  )
}

export default Layout
