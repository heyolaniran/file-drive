'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MoreVertical, TrashIcon } from "lucide-react"
import { AlertDialogCard } from "./AlertDialogCard"
import { useState } from "react"
import { Doc } from "../../convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
  
export function FileCardMenu ({file} : {file : Doc<"files">}) {
    const [isOpenDialog, setIsOpenDialog] = useState(false) ; 

    const deleteFile = useMutation(api.files.deleteFile) ; 

    const deleteFn = () => {
       deleteFile({
        fileId : file._id
       })
    }

    return (
        <>
            <AlertDialogCard trigger={isOpenDialog} changeTriggerFn={setIsOpenDialog} file={file} executeFn={deleteFn} />

            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setIsOpenDialog(true)} className="flex gap-1 items-center cursor-pointer text-red-600 ">
                        <TrashIcon className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                    
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        

        

    )
}