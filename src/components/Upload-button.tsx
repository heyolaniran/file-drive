"use client";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { IoPushOutline } from "react-icons/io5";

import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(2).max(200),
  file: z
    .custom<FileList>((value) => value instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export function UploadButton() {
  const organization = useOrganization();

  const user = useUser();
  // define organization / user id
  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    // if we get an organization id or user id
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const createFile = useMutation(api.files.createFile);

  // toast

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // closing dialog automatically

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  // submit form

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },

      body: values.file[0],
    });

    const { storageId } = await result.json();

    // file types
    const types  = {
      'image/png' : 'png', 
      'application/pdf' : 'pdf' , 
      'text/csv' : 'csv' ,
    } as Record<string, Doc<'files'>['type']>

    if (!orgId) {
      return;
    }

    try {
      await createFile({
        name: values.name,
        type : types[values.file[0].type] !, 
        fileId: storageId,
        orgId,
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "Done !",
        description: "Your file is uploaded",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops !",
        description:
          "Something went wrong, your file could not be uploaded. Please try again later",
      });
    }
  }

  // searching files for organization id or by user id if there is not organization

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="px-auto" onClick={() => console.log("hi")}>
          <IoPushOutline /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Upload</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Name</FormLabel>
                      <FormControl>
                        <Input placeholder="put your file name" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            placeholder="Add your file"
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isLoading}
                  className="flex gap-2"
                >
                  {form.formState.isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {form.formState.isLoading ? "Uploading" : "Submit"}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
