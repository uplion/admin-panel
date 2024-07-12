
import Link from "next/link"
import { PlusIcon } from '@heroicons/react/24/outline';
import { Models, ModelsSkeleton } from "@/components/model/models";
import { Suspense } from "react";

export default function Page() {

  return (
    <>
      <div>
        <div className="float-start">
          <h1 className="font-extrabold">
            Models
          </h1>
        </div>

        <Link
          href="/model/add"
          className="float-end flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Add new AI model</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <Suspense fallback={<ModelsSkeleton />}>
        <Models />
      </Suspense>
    </>
  )
}

