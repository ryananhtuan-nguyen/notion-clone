import TitleSection from '@/components/landing-page/TitleSection'
import React from 'react'

const Home = () => {
  return (
    <section>
      <div className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection
          pill="✨ Your Workspace, Perfected"
          title="All-In-One Collaboration and Productivity Platform"
        />
      </div>
    </section>
  )
}

export default Home
