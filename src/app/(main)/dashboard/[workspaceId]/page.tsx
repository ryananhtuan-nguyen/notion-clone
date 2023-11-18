export const dynamic = 'force-dynamic'

import React from 'react'
import { redirect } from 'next/navigation'

import { getWorkspaceDetails } from '@/lib/supabase/queries'
import QuillEditor from '@/components/quill-editor/QuillEditor'

const WorkspacePage = async ({
  params,
}: {
  params: { workspaceId: string }
}) => {
  const { data, error } = await getWorkspaceDetails(params.workspaceId)
  if (error || !data.length) redirect('/dashboard')

  return (
    <div className="relative">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default WorkspacePage
