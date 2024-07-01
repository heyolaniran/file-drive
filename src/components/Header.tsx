
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'

export default function Header() {
  return (
    <div className=''>
        <div className=" items-center container mx-auto justify-between py-2 flex">
          <p className='font-bold text-lg'>File Driver</p> 
          <div className=" items-center flex gap-2">
           

            <SignedIn>
              <OrganizationSwitcher /> 
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode='modal'>
                <Button className='px-6  rounded-full '> Log in  </Button>
              </SignInButton>
            </SignedOut>
           
          </div>
          
        </div>
    </div>
  )
}
