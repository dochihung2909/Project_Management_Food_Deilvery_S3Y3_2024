import { Spinner } from '@material-tailwind/react'
import React from 'react'

export default function Loading() {
  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 bg-gray-500 bg-opacity-50 z-10'> 
        <div className='flex items-center justify-center h-full'> 
            <Spinner></Spinner>  
        </div>
    </div>
  )
}
