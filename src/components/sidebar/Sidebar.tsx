import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/supabase/queries'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface SidebarProps {
  params: { workspaceId: string }
  className?: string
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies })

  //user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  //subscription status
  const { data: subscription, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id)

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  )

  //error
  if (subscriptionError || foldersError) redirect('/dashboard')

  //get all the different workspaces private collaborating shared
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ])

  return (
    <aside className="hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between"></aside>
  )
}

export default Sidebar
