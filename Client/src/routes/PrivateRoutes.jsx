import React from 'react'
import { Outlet } from 'react-router'

const PrivateRoutes = ({allowedRoutes}) => {
  return (
    <Outlet />
  )
}

export default PrivateRoutes