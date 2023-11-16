'use client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface EmojiPickerProps {
  children: React.ReactNode
  getValue?: (emoji: string) => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => {
  const router = useRouter()
  const Picker = dynamic(() => import('emoji-picker-react'))

  const onClick = (selectEmoji: any) => {
    if (getValue) getValue(selectEmoji.emoji)
  }

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <Picker onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default EmojiPicker
