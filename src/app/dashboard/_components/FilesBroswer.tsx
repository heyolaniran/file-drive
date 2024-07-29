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
import { GridIcon, RowsIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilesBroswer({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {

  const [type, setType] = useState('all') ; 
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
    orgId ? { orgId, query, favoritesOnly, deletedOnly, type } : "skip",
  );

  console.log(files) ; 

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
            <div className="justify-between flex items-center">
              <div>
              <TabsList >
                <TabsTrigger value="grid" className="flex gap-2 items-center"> <GridIcon/> Grid</TabsTrigger>
                <TabsTrigger value="table" className="flex gap-2 items-center"> <RowsIcon/> Table</TabsTrigger>
              </TabsList>
              </div>

              <div>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
           
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
