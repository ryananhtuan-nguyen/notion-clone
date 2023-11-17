import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import CypressHomeIcon from '../icons/cypressHomeIcon'

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
      <ul className="flex flex-col">
        <li>
          <Link
            className="group/native flex text-Neutrals/neutrals-7 transition-all"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <CypressHomeIcon />
            <span>My Workspace</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NativeNavigation
