'use client'
import { Button } from "@/components/ui/button";
import { SignInButton,  SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


export default function Home() {

  const  organization = useOrganization() ;

  const user = useUser(); 
  // define organization / user id 
  let orgId = null ; 


  if(organization.isLoaded && user.isLoaded) {

     // if we get an organization id or user id 
      orgId = organization.organization?.id ??  user.user?.id

  }

  const createFile = useMutation(api.files.createFile)

  // searching files for organization id or by user id if there is not organization 

  const files = useQuery(api.files.getFiles, orgId  ? { orgId } : 'skip'  ) ; 
 
 
  // create file logic 

  const handleCreateFile = () => {

     if(!orgId) {
        return ; 
     }

     createFile({
      name: 'Hello', 
      orgId 
     })
  }



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {files?.map((file) => {
        return <div key={file._id}> {file.name} </div>
      })}


      <Button onClick={handleCreateFile}>
        Click me
      </Button>
      
      
    </main>
  );
}
