"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadButton } from "@/components/Upload-button";
import { FileCard } from "@/components/FileCard";
import { Empty } from "@/components/ui/empty";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const organization = useOrganization();

  const user = useUser();
  // define organization / user id

  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    // if we get an organization id or user id
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // searching files for organization id or by user id if there is not organization

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : "skip");

  return (
    <main className="container mx-auto pt-12">
      {user.isLoaded && !user.isSignedIn && <Hero />}

      <div className="flex">
        <div className="w-40 flex flex-col gap-4">
          <Link href={"/"}>
            <Button variant={"link"} className="flex gap-2">
              {" "}
              <FileIcon /> All Files{" "}
            </Button>
          </Link>

          <Link href={"/favorites"}>
            <Button variant={"link"} className="flex gap-2">
              {" "}
              <StarIcon /> Favorites{" "}
            </Button>
          </Link>


        </div>

        <div className="w-full">
          {user.isSignedIn && (
            <div className="flex justify-between mb-12">
              <h1 className="text-4xl font-bold"> Your files </h1>
              <SearchBar query={query} setQuery={setQuery} />
              <UploadButton />
            </div>
          )}

          {files !== undefined && (
            <div className="grid lg:grid-cols-4 md:grid-cols-1 lg:gap-4 mt-4">
              {files?.map((file) => <FileCard key={file._id} file={file} />)}
            </div>
          )}

          {files?.length == 0 && <Empty />}
        </div>
      </div>
    </main>
  );
}
