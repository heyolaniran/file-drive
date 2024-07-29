import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="">
      <div className=" items-center container mx-auto justify-between py-2 flex">
        <div className="items-center gap-4">
          <Link href={"/"} className="text-lg font-bold">
            File Driver
          </Link>

          <Link href={"/dashboard/files"} className="px-4">
            Your files
          </Link>
        </div>

        <div className=" items-center flex gap-2">
          <SignedIn>
            <OrganizationSwitcher />
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="px-6  rounded-full "> Log in </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
