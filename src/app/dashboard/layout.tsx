"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="container mx-auto pt-12">
      <div className="flex">
        <div className="w-40 flex flex-col gap-4">
          <Link href={"/dashboard/files"}>
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/dashboard/files"),
              })}
            >
              {" "}
              <FileIcon /> All Files{" "}
            </Button>
          </Link>

          <Link href={"/dashboard/favorites"}>
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/dashboard/favorites"),
              })}
            >
              {" "}
              <StarIcon /> Favorites{" "}
            </Button>
          </Link>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
