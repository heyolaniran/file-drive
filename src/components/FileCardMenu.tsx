"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DownloadCloud,
  MoreVertical,
  StarHalfIcon,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { AlertDialogCard } from "./AlertDialogCard";
import { useState } from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery, } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "./ui/use-toast";
import { Protect } from "@clerk/nextjs";

export function FileCardMenu({
  isFavorited,
  file,
}: {
  isFavorited: boolean;
  file: Doc<"files"> & {url : string};
}) {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toogleFavorite = useMutation(api.files.toogleFavorite);

  const me  = useQuery(api.users.getMe) ; 
  const deleteFn = async () => {
    await deleteFile({
      fileId: file._id,
    });

    toast({
      variant: "success",
      title: "Done",
      description: "The file is now moved to the trash",
    });
  };

  const restoreFn = async () => {
    await restoreFile({ fileId: file._id });

    toast({
      variant: "success",
      title: "Done",
      description: "The file is now restored to your repository",
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
          {!file.shouldDelete && (
            <DropdownMenuItem
              onClick={() => {
                toogleFavorite({
                  fileId: file._id,
                });
              }}
              className="flex gap-1 items-center cursor-pointer "
            >
              {isFavorited ? (
                <div className="flex gap-2 items-center">
                  <StarHalfIcon className="w-4 h-4 " /> Unfavorite
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <StarIcon className="w-4 h-4" /> Favorite
                </div>
              )}{" "}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              window.open(file.url);
            }}
          >
            <DownloadCloud className="w-4 h-4" /> Download
          </DropdownMenuItem>

          <Protect condition={(check) => {
            return check({
              role : "org:admin"
            }) || file.userId == me?._id 
          }} fallback={<p></p>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (!file.shouldDelete) {
                  setIsOpenDialog(true);
                } else {
                  restoreFn();
                }
              }}
              className=""
            >
              {file.shouldDelete ? (
                <div className="flex gap-1 items-center cursor-pointer text-green-500">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 items-center cursor-pointer text-red-500">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
