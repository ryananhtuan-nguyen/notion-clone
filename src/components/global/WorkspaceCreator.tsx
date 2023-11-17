'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { User } from '@/lib/supabase/supabase.types'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser()
  const router = useRouter()
  const [permissions, setPermissions] = useState('private')
  const [title, setTitle] = useState('')
  const [collaborators, setCollaborators] = useState<User[]>([])

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user])
  }

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id))
  }

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center gap-2">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permission
        </Label>
      </>
    </div>
  )
}

export default WorkspaceCreator
