
import { UserButton } from '@clerk/nextjs'
import React from 'react'

export default function Header() {
  return (
    <div className=''>
        <div className="container mx-auto justify-between py-2 flex">
          <p className='font-bold text-lg'>File Driver</p> 

          <UserButton />
        </div>
    </div>
  )
}
