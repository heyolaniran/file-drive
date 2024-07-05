import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { HamIcon, MoreVertical, TrashIcon } from "lucide-react"
  
export function FileCardMenu () {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="flex gap-1 items-center cursor-pointer text-red-600 ">
                    <TrashIcon className="w-4 h-4"/> Delete
                </DropdownMenuItem>
                
            </DropdownMenuContent>
        </DropdownMenu>

    )
}