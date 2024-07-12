import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { SignIn, SignInButton } from "@clerk/nextjs";

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

        <SignInButton mode="modal">
          <Button className="mt-4">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </SignInButton>
      </div>
    </section>
  );
}
