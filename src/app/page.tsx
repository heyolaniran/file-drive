"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "@/components/Upload-button";
import { FileCard } from "@/components/FileCard";
import { Empty } from "@/components/ui/empty";

export default function Home() {
  const organization = useOrganization();

  const user = useUser();
  // define organization / user id
  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    // if we get an organization id or user id
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // searching files for organization id or by user id if there is not organization

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto py-12">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold"> Your files </h1>

        <UploadButton />
      </div>

      

      {files !== undefined && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {files?.map((file) => <FileCard key={file._id} file={file} />)}
        </div>
      )}

    {files && <Empty />}
      
    </main>
  );
}
