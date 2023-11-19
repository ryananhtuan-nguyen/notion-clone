import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import TrashRestore from './TrashRestore'

interface TrashProps {
  children: React.ReactNode
}

const Trash: React.FC<TrashProps> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Trash" content={<TrashRestore />}>
      {children}
    </CustomDialogTrigger>
  )
}

export default Trash
