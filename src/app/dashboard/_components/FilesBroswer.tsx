"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import SearchBar from "@/components/SearchBar";
import { UploadButton } from "@/components/Upload-button";
import { FileCard } from "@/components/FileCard";
import { Empty } from "@/components/ui/empty";
import { DataTable } from "./file-card";
import { columns } from "./colums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GridIcon, TableIcon } from "lucide-react";

export default function FilesBroswer({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();

  const user = useUser();
  // define organization / user id

  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    // if we get an organization id or user id
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // get favorites lists

  const favorites = useQuery(api.files.getAllFavorites, {
    orgId: orgId ? orgId : "skip",
  });

  // searching files for organization id or by user id if there is not organization

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favoritesOnly, deletedOnly } : "skip",
  );

  const modifiedFiles = files?.map((file) => ({
    ...file, 
    isFavorited : (favorites ?? []).some((favorite) => favorite.fileId == file._id)
  })) ?? [] ; 

  return (
    <div className="w-full">
      {user.isSignedIn && (
        <div className="flex justify-between mb-12">
          <h1 className="text-4xl font-bold">{title} </h1>
          <SearchBar query={query} setQuery={setQuery} />
          <UploadButton />
        </div>
      )}


  


      {files !== undefined && (
        <>

          <Tabs defaultValue="grid">
            <TabsList >
              <TabsTrigger value="grid" className="flex gap-2 items-center"> <GridIcon/> Grid</TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center"> <TableIcon/> Table</TabsTrigger>
            </TabsList>
            <TabsContent value="grid"> 
              <div className="grid lg:grid-cols-4 md:grid-cols-1 lg:gap-4 mt-4">
                {modifiedFiles?.map((file) => (
                  <FileCard key={file._id}  file={file} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles}></DataTable>
            </TabsContent>
          </Tabs>
          

          
        </>
      )}

      {files?.length == 0 && <Empty />}
    </div>
  );
}
