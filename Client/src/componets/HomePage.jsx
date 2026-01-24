import React from 'react'
import Navbar from './subComponents/hompageComponents/Navbar'
import Herosection from './subComponents/hompageComponents/Herosection'
import SystemPerformanceMatrix from './subComponents/hompageComponents/SystemPerformanceMatrix'

const HomePage = () => {
  return (
    <div>
        <Navbar />
        <Herosection />
        <SystemPerformanceMatrix />
    </div>
  )
}

export default HomePage