import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { UploadBannerFormSchema } from '@/lib/types'
import { useAppState } from '@/lib/providers/state-provider'
import { z } from 'zod'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Loader from '../global/Loader'
import {
  updateFile,
  updateFolder,
  updateWorkspace,
} from '@/lib/supabase/queries'

interface BannerUploadFormProps {
  dirType: 'workspace' | 'folder' | 'file'
  id: string
}

const BannerUploadForm: React.FC<BannerUploadFormProps> = ({ dirType, id }) => {
  const supabase = createClientComponentClient()
  const { state, workspaceId, folderId, dispatch } = useAppState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof UploadBannerFormSchema>>({
    mode: 'onChange',
    // resolver: zodResolver(UploadBannerFormSchema),
    defaultValues: {
      banner: '',
    },
  })
  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UploadBannerFormSchema>
  > = async (values) => {
    const file = values.banner?.[0]
    if (!file || !id) return
    try {
      let filePath = null
      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from('file-banners')
          .upload(`banner-${id}`, file, {
            cacheControl: '5',
            upsert: true,
          })
        if (error) throw new Error()
        filePath = data.path
      }

      switch (dirType) {
        case 'file':
          {
            if (!workspaceId || !folderId) return
            await uploadBanner()
            dispatch({
              type: 'UPDATE_FILE',
              payload: {
                file: { bannerUrl: filePath },
                fileId: id,
                folderId,
                workspaceId,
              },
            })
            await updateFile({ bannerUrl: filePath }, id)
          }
          break
        case 'folder':
          {
            if (!workspaceId || !folderId) return
            await uploadBanner()
            dispatch({
              type: 'UPDATE_FOLDER',
              payload: {
                folderId: id,
                folder: { bannerUrl: filePath },
                workspaceId,
              },
            })
            await updateFolder({ bannerUrl: filePath }, id)
          }
          break
        case 'workspace':
          {
            if (!workspaceId) return
            await uploadBanner()
            dispatch({
              type: 'UPDATE_WORKSPACE',
              payload: {
                workspace: { bannerUrl: filePath },
                workspaceId,
              },
            })
            await updateWorkspace({ bannerUrl: filePath }, id)
          }
          break
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-2"
    >
      <Label className="text-sm text-muted-foreground" htmlFor="bannerImage">
        Banner Image
      </Label>
      <Input
        id="bannerImage"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register('banner', { required: 'Banner Image is required' })}
      />

      <small className="text-red-600">
        {errors.banner?.message?.toString()}
      </small>

      <Button disabled={isUploading} type="submit">
        {!isUploading ? 'Upload Banner' : <Loader />}
      </Button>
    </form>
  )
}

export default BannerUploadForm
