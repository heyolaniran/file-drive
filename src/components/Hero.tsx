import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignIn, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Hero() {
  return (
    <section>
      <div className="p-8 md:p-12 lg:px-16 lg:py-32 text-center">
        <div className="mx-auto max-w-lg ">
          <h2 className="text-3xl pb-4 text-black font-bold  sm:text-5xl">
            File Drive Project
          </h2>

          <span className="text-md font-bold">
            {" "}
            Manage - Protect - Reliable your files.{" "}
          </span>
        </div>

        <SignedOut>
          <SignInButton mode="modal">
            <Button className="mt-4">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </SignInButton>
        </SignedOut>
        

        <SignedIn>
          <Link href={'/dashboard/files'}>
          <Button className="mt-4">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          </Link>
        </SignedIn>
      </div>
    </section>
  );
}
