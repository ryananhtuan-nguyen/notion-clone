import { AuthUser } from '@supabase/supabase-js'
import React from 'react'

interface DashboardSetupProps {
  user: AuthUser
  subscription: {} | null
}

const DashboardSetup = () => {
  return <div>DashboardSetup</div>
}

export default DashboardSetup
