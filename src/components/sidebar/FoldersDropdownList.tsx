'use client'
import React, { useEffect, useState } from 'react'

import { Folder } from '@/lib/supabase/supabase.types'
import { useAppState } from '@/lib/providers/state-provider'

interface FoldersDropdownListProps {
  workspaceFolders: Folder[]
  workspaceId: string
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  //local state folders (Progressing)
  //setup realtime updates (Progressing)
  const { state, dispatch } = useAppState()
  const [folders, setFolders] = useState(workspaceFolders)

  //effect set initial state server app state
  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: 'SET_FOLDERS',
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      })
    }
  }, [workspaceFolders, workspaceId])

  //state
  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    )
  }, [state])

  //add folder

  //return

  return (
    <div className="flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8">
      <span className="text-Neutrals-8 font-bold text-xs">FOLDERS</span>
    </div>
  )
}

export default FoldersDropdownList
