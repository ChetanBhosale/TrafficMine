import Header from '@/components/custom/Header/Header'
import Banner from '@/components/custom/LandingPage/Banner'
import React from 'react'

const page = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <Banner />
      </div>
    </div>
  )
}

export default page