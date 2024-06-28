
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'

export default function Header() {
  return (
    <div className=''>
        <div className=" items-center container mx-auto justify-between py-2 flex">
          <p className='font-bold text-lg'>File Driver</p> 
          <div className="flex gap-2">
            <OrganizationSwitcher /> 
            <UserButton />
          </div>
          
        </div>
    </div>
  )
}
