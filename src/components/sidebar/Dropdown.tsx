'use client'
import React, { useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { useAppState } from '@/lib/providers/state-provider'
import { useRouter } from 'next/navigation'
import { AccordionItem, AccordionTrigger } from '../ui/accordion'
import { cn } from '@/lib/utils'
import EmojiPicker from '../global/EmojiPicker'
import { createFile, updateFile, updateFolder } from '@/lib/supabase/queries'
import { toast, useToast } from '../ui/use-toast'
import TooltipComponent from '../global/TooltipComponent'
import { PlusIcon, Trash } from 'lucide-react'
import { v4 } from 'uuid'
import { File } from '@/lib/supabase/supabase.types'
import { AccordionContent } from '@radix-ui/react-accordion'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'

interface DropdownProps {
  title: string
  id: string
  listType: 'folder' | 'file'
  iconId: string
  children?: React.ReactNode
  disabled?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const supabase = createClientComponentClient()
  const { user } = useSupabaseUser()
  const { state, dispatch, workspaceId, folderId } = useAppState()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  //folder Title synced with server data and local
  //---------------------FOLDER TITLE-------------------------
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === 'folder') {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  }, [state, listType, workspaceId, id, title])

  //---------------------FILE TITLE--------------------------
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === 'file') {
      const fileAndFolderId = id.split('folder')
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  }, [state, listType, workspaceId, id, title])
  //Navigate user to different page
  //---------------------NAVIGATION-------------------------------
  const navigatePage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`)
    }
    if (type === 'file') {
      router.push(
        `/dashboard/${workspaceId}/${folderId}/${
          accordionId.split('folder')[1]
        }`
      )
    }
  }
  // Add a file
  //-----------------ADD NEW FILE---------------------------------
  const addNewFile = async () => {
    if (!workspaceId) return

    const newFile: File = {
      folderId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: 'Untitled',
      iconId: '📄',
      id: v4(),
      workspaceId,
      bannerUrl: '',
    }

    dispatch({
      type: 'ADD_FILE',
      payload: { file: newFile, folderId: id, workspaceId },
    })

    const { error } = await createFile(newFile)

    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create a file',
      })
    } else {
      toast({
        title: 'Success',
        description: 'File created.',
      })
    }
  }

  //DoubleClickHandler

  //------------------DOUBLECLICK----------------------------
  const handleDoubleClick = () => {
    setIsEditing(true)
  }
  //blur
  //------------------HANDLE BLUR INPUT---------------------
  const handleBlur = async () => {
    setIsEditing(false)
    const fId = id.split('folder')
    if (fId.length === 1) {
      if (!folderTitle) return
      const { error } = await updateFolder(
        {
          title,
        },
        fId[0]
      )
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Failed changing folder title',
        })
      }
    }
    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return
      // update the file
      const { error } = await updateFile(
        {
          title: fileTitle,
        },
        fId[1]
      )
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Failed changing file title',
        })
      }
    }
  }

  //on changes
  //-------------------UPDATE EMOJI-----------------------------------
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return
    if (listType === 'folder') {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji },
        },
      })
      const { error } = await updateFolder(
        {
          iconId: selectedEmoji,
        },
        id
      )
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not update the emoji for this folder',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Edited emoji for the folder',
        })
      }
    }
  }

  //-------------UPDATE FOLDER/FILE TITLE---------------------
  //----FOLDER-------
  const folderTitleChange = (e: any) => {
    if (!workspaceId) return
    const fId = id.split('folder')
    if (fId.length === 1) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { title: e.target.value },
          folderId: fId[0],
          workspaceId,
        },
      })
    }
  }
  //-------FILE-------
  const fileTitleChange = (e: any) => {
    if (!workspaceId || !folderId) return
    const fId = id.split('folder')
    if (fId.length === 2 && fId[1]) {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          file: { title: e.target.value },
          folderId,
          workspaceId,
          fileId: fId[1],
        },
      })
    }
  }

  //move to trash
  //-----------------------MOVE TO TRASH--------------------------------------
  const moveToTrash = async () => {
    if (!user?.email || !workspaceId) return
    const pathId = id.split('folder')
    if (listType === 'folder') {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { inTrash: `Deleted by ${user.email}` },
          folderId: pathId[0],
          workspaceId,
        },
      })
      const { error } = await updateFolder(
        { inTrash: `Deleted by ${user.email}` },
        pathId[0]
      )
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not move the folder to Trash',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Folder moved to Trash',
        })
      }
    }

    if (listType === 'file') {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          file: { inTrash: `Deleted by ${user?.email}` },
          folderId: pathId[0],
          workspaceId,
          fileId: pathId[1],
        },
      })
      const { error } = await updateFile(
        { inTrash: `Deleted by ${user.email}` },
        pathId[1]
      )
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not move the file to trash',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Moved file to trash',
        })
      }
    }
  }

  //------------------------------STYLING---------------------------------------
  const isFolder = listType === 'folder'
  //----------------LIST STYLING---------------------------
  const listStyles = useMemo(
    () =>
      cn('relative', {
        'border-none text-md': isFolder,
        'border-none ml-6 text-[16px] py-1': !isFolder,
      }),
    [isFolder]
  )
  //----------------GROUP-------------------------
  const groupIdentifies = useMemo(
    () =>
      cn(
        'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
        {
          'group/folder': isFolder,
          'group/file': !isFolder,
        }
      ),
    [isFolder]
  )

  //--------------HOVER STYLING-----------------------------

  const hoverStyles = useMemo(
    () =>
      cn(
        'h-full hidden rounded-sm absolute right-0 items-center justify-center',
        {
          'group-hover/file:block': listType === 'file',
          'group-hover/folder:block': listType === 'folder',
        }
      ),
    [listType]
  )

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation()
        navigatePage(id, listType)
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline p-2 dark:text-muted-foreground text-sm"
        disabled={listType === 'file'}
      >
        <div className={groupIdentifies}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={cn(
                'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
                {
                  'bg-muted cursor-text': isEditing,
                  'bg-transparent cursor-pointer': !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === 'folder' ? folderTitleChange : fileTitleChange
              }
            />
          </div>
          <div className={hoverStyles}>
            <TooltipComponent
              message={listType === 'folder' ? 'Delete Folder' : 'Delete File'}
            >
              <Trash
                onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === 'folder' && !isEditing && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {state.workspaces
          .find((workspace) => workspace.id === workspaceId)
          ?.folders.find((folder) => folder.id === id)
          ?.files.filter((file) => !file.inTrash)
          .map((file) => {
            const customFileId = `${id}folder${file.id}`
            return (
              <Dropdown
                key={file.id}
                title={file.title}
                listType="file"
                id={customFileId}
                iconId={file.iconId}
              />
            )
          })}
      </AccordionContent>
    </AccordionItem>
  )
}

export default Dropdown
