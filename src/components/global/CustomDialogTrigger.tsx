'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CustomDialogTriggerProps {
  header?: string
  content?: React.ReactNode
  children: React.ReactNode
  description?: string
  footer?: string
  className?: string
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  header,
  content,
  children,
  description,
  footer,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger className={cn('', className)}>{children}</DialogTrigger>
      <DialogContent className="h-screen block sm:h-[440px] overflow-scroll w-full">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialogTrigger
