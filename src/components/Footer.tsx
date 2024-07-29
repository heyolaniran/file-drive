import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-32">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center  sm:justify-start">
            File Driver
          </div>

          <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
            Copyright &copy; {(new Date()).getFullYear()} All rights reserved. By <Link href={'https://x.com/heyolaniran'} className=" underline underline-offset-2"> Olaniran </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
