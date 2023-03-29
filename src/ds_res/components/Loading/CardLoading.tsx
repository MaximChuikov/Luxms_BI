import React from 'react'
import { Skeleton } from '@mui/material'

const CardLoading = () => {
  return (
    <div>
      <Skeleton height={118} width={'100%'} />
      <Skeleton width={'100%'} />
      <Skeleton width="60%" />
    </div>
  )
}

export default CardLoading
