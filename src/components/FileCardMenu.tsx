"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, StarIcon, TrashIcon } from "lucide-react";
import { AlertDialogCard } from "./AlertDialogCard";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "./ui/use-toast";

export function FileCardMenu({ file }: { file: Doc<"files"> }) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const deleteFile = useMutation(api.files.deleteFile);
  const toogleFavorite = useMutation(api.files.toogleFavorite);

  const deleteFn = async () => {
    await deleteFile({
      fileId: file._id,
    });

    toast({
      variant: "success",
      title: "Done",
      description: "The file is now gone from your system",
    });
  };

  return (
    <>
      <AlertDialogCard
        trigger={isOpenDialog}
        changeTriggerFn={setIsOpenDialog}
        file={file}
        executeFn={deleteFn}
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              toogleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer "
          >
            <StarIcon className="w-4 h-4" /> Favorite
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsOpenDialog(true)}
            className="flex gap-1 items-center cursor-pointer text-red-600 "
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
