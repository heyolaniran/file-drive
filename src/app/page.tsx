'use client'
import { Button } from "@/components/ui/button";
import { SignInButton,  SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { IoPushOutline } from "react-icons/io5";

import { DialogHeader, Dialog, DialogContent,DialogTrigger, DialogTitle, DialogDescription} from "@/components/ui/dialog";

import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
 
const formSchema = z.object({
  name: z.string().min(2).max(200),
  file : z.custom<FileList>((value) => value instanceof FileList, 'Required')
  .refine((files) => files.length > 0, 'Required')
})

export default function Home() {

  


  const  organization = useOrganization() ;

  const user = useUser(); 
  // define organization / user id 
  let orgId : string | undefined  = undefined ; 

  

  if(organization.isLoaded && user.isLoaded) {

     // if we get an organization id or user id 
      orgId = organization.organization?.id ??  user.user?.id

  }

  const createFile = useMutation(api.files.createFile)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      file: undefined
    },
  })

  const fileRef = form.register('file')

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  
  // closing dialog automatically 

  const [isFileDialogOpen , setIsFileDialogOpen]= useState(false)

  // submit form 

  async function onSubmit(values : z.infer<typeof formSchema>) {

    console.log(values)

    const postUrl = await generateUploadUrl() 

    const result = await fetch(postUrl, {
      method : 'POST', 
      headers : {"Content-Type" : values.file[0].type}, 

      body : values.file[0]
    })

    const {storageId} = await result.json() ; 

    if(!orgId) {
      return ; 
   }

   await createFile({
    name: values.name,
    fileId: storageId,  
    orgId 
   })


   form.reset() ; 

   setIsFileDialogOpen(true)

  }


  
  
  // searching files for organization id or by user id if there is not organization 

  const files = useQuery(api.files.getFiles, orgId  ? { orgId } : 'skip'  ) ; 
 
  


  return (
    <main className="container mx-auto py-12">

      <div className="flex justify-between">
        <h1 className="text-4xl font-bold"> Your files </h1>

        <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-auto" onClick={() => console.log('hi')}>
              <IoPushOutline /> Upload 
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File Upload</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File Name</FormLabel>
                          <FormControl>
                            <Input placeholder="put your file name" {...field} />
                          </FormControl>
                          <FormDescription>
                            
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field  }) => {
                        return (
                          <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                              <Input type="file" placeholder="Add your file" {...fileRef} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

       
      </div>

      {files?.map((file) => {
        return <div key={file._id}> {file.name} </div>
      })}


      
      
      
    </main>
  );
}
