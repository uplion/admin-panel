
import Link from "next/link"
import { PlusIcon } from '@heroicons/react/24/outline';
import { Tokens, TokensSkeleton } from "@/components/token/tokens";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'

export default function Page() {

  return (
    <>
      <div>
        <div className="float-start">
          <h1 className="font-extrabold">
            Tokens
          </h1>
        </div>

        <Link
          href="/token/add"
          className="float-end flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Add new token</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <Suspense fallback={<TokensSkeleton />}>
        <Tokens />
      </Suspense>
    </>
  )
}

