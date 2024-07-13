import Link from "next/link"
import Image from "next/image"


export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 py-24 px-16">
      <div
        className="w-[300px] h-[300px] z-1 relative flex place-items-center mb-12"
      >
        <Image
          src="/admin/logo.png"
          alt="logo"
          height={300}
          width={300}
          className="object-cover absolute top-0 left-0"
        ></Image>
        <div className=" absolute top-0 left-0 w-full h-full z-1" style={{ background: "radial-gradient(circle, rgba(255, 255, 255, 0) 40%, white 70%)" }}></div>
      </div>

      <h1 className="font-extrabold text-4xl lg:text-6xl text-center">
        Uplion Admin Panel
      </h1>

      <div className="grid mt-12 lg:mt-24 w-full max-w-5xl text-center lg:text-left lg:space-y-0 space-y-4 lg:grid-cols-2 grid-cols-1">
        <Link
          href='/token'
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Tokens{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-sm opacity-50">
            Manage API tokens and access keys of your cluster.
          </p>
        </Link>

        <Link
          href="/model"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            AI Models{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 text-sm opacity-50">
            Manage and monitor your AI models in your cluster.
          </p>
        </Link>

      </div>
    </main>
  );
}
