import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function AlertDialogCard({
  trigger,
  changeTriggerFn,
  executeFn,
  file,
}: {
  trigger: boolean;
  changeTriggerFn: Dispatch<SetStateAction<boolean>>;
  executeFn: () => void;
  file: Doc<"files">;
}) {
  return (
    <AlertDialog open={trigger} onOpenChange={changeTriggerFn}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the file as delected in your trash repository.
            Do you want to continue ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={executeFn}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
