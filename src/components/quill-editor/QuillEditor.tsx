'use client'

import React, { useCallback, useMemo, useState } from 'react'
import 'quill/dist/quill.snow.css'

import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import { useAppState } from '@/lib/providers/state-provider'
import { Button } from '../ui/button'
import {
  deleteFile,
  deleteFolder,
  updateFile,
  updateFolder,
} from '@/lib/supabase/queries'

interface QuillEditorProps {
  dirDetails: File | Folder | workspace
  fileId: string
  dirType: 'workspace' | 'folder' | 'file'
}

var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
]

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  dirType,
  fileId,
}) => {
  const { state, workspaceId, folderId, dispatch } = useAppState()
  const [quill, setQuill] = useState<any>(null)

  const details = useMemo(() => {
    let selectedDir
    switch (dirType) {
      case 'file':
        {
          selectedDir = state.workspaces
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.find((folder) => folder.id === folderId)
            ?.files.find((file) => file.id === fileId)
        }
        break
      case 'folder':
        {
          selectedDir = state.workspaces
            .find((workspace) => workspace.id === workspaceId)
            ?.folders.find((folder) => folder.id === fileId)
        }
        break
      case 'workspace':
        {
          selectedDir = state.workspaces.find(
            (workspace) => workspace.id === fileId
          )
        }
        break
    }

    if (selectedDir) {
      return selectedDir
    }

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as workspace | Folder | File
  }, [state, workspaceId, folderId, dirDetails, dirType, fileId])

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== 'undefined') {
      if (wrapper === null) return
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const Quill = (await import('quill')).default
      //WIP cursors

      //Manually mounting component
      const q = new Quill(editor, {
        theme: 'snow',
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          //WIP CURSOR
        },
      })
      setQuill(q)
    }
  }, [])

  // const restoreFileHandler = async () => {
  //   if (dirType === 'file') {
  //     if (!folderId || !workspaceId) return
  //     dispatch({
  //       type: 'UPDATE_FILE',
  //       payload: { file: { inTrash: '' }, fileId, folderId, workspaceId },
  //     })
  //     await updateFile({ inTrash: '' }, fileId)
  //   }
  //   if (dirType === 'folder') {
  //     if (!workspaceId) return
  //     dispatch({
  //       type: 'UPDATE_FOLDER',
  //       payload: {
  //         folder: {
  //           inTrash: '',
  //         },
  //         folderId: fileId,
  //         workspaceId,
  //       },
  //     })
  //     await updateFolder({ inTrash: '' }, fileId)
  //   }
  // }

  // const handleDeleteFile = async () => {
  //   if (dirType === 'file') {
  //     if (!folderId || !workspaceId || !fileId) return
  //     dispatch({
  //       type: 'DELETE_FILE',
  //       payload: { workspaceId, folderId: fileId, fileId },
  //     })
  //     await deleteFile(fileId)
  //   }
  //   if (dirType === 'folder') {
  //     if (!workspaceId || !fileId) return
  //     dispatch({
  //       type: 'DELETE_FOLDER',
  //       payload: {
  //         folderId: fileId,
  //         workspaceId,
  //       },
  //     })
  //     await deleteFolder(fileId)
  //   }
  // }

  return (
    <>
      <div className="relative">
        {details.inTrash && (
          <article className="py-2 bg-[#EB5757] flex md:flex-row flex-col justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
              <span className="text-white">
                This {dirType} is in the trash.
              </span>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={restoreFileHandler}
              >
                Restore
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#EB5757]"
                onClick={handleDeleteFile}
              >
                Delete
              </Button>
            </div>
          </article>
        )}
      </div>
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div id="container" ref={wrapperRef} className="max-w-[800px]"></div>
      </div>
    </>
  )
}

export default QuillEditor
