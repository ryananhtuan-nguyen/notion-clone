import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import SettingForm from './SettingForm'

interface SettingsProps {
  children: React.ReactNode
}

const Settings: React.FC<SettingsProps> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Settings" content={<SettingForm />}>
      {children}
    </CustomDialogTrigger>
  )
}

export default Settings
