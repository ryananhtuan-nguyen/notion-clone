import React from 'react'

import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import {
  appFoldersType,
  appWorkspacesType,
} from '@/lib/providers/state-provider'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import BannerUploadForm from './BannerUploadForm'

interface BannerUploadProps {
  children: React.ReactNode
  className?: string
  dirType: 'workspace' | 'folder' | 'file'
  id: string
  details: appWorkspacesType | appFoldersType | File | workspace | Folder
}

const BannerUpload: React.FC<BannerUploadProps> = ({
  children,
  className,
  details,
  dirType,
  id,
}) => {
  return (
    <CustomDialogTrigger
      header="Upload Banner"
      content={<BannerUploadForm dirType={dirType} id={id} />}
      className={className}
    >
      {children}
    </CustomDialogTrigger>
  )
}

export default BannerUpload
