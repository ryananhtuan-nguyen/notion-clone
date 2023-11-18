import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import CypressHomeIcon from '../icons/cypressHomeIcon'
import CypressSettingsIcon from '../icons/cypressSettingsIcon'
import CypressTrashIcon from '../icons/cypressTrashIcon'
import Settings from '../settings/Settings'

interface NativeNavigationProps {
  myWorkspaceId: string
  className?: string
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
}) => {
  return (
    <nav className={cn('my-2', className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native flex text-Neutrals/neutrals-7 transition-all gap-2"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>
        <Settings>
          <li className="group/native flex text-Neutrals/neutrals-7 transition-all gap-2 cursor-pointer">
            <CypressSettingsIcon />
            <span>Settings</span>
          </li>
        </Settings>
        <li>
          <Link
            className="group/native flex text-Neutrals/neutrals-7 transition-all gap-2"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressTrashIcon />
            <span>Trash</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NativeNavigation
