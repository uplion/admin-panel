import { fetchModel } from "../../api/models"
import { notFound } from "next/navigation";

import { CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Square3Stack3DIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button";
import { getModelStatus } from "@/lib/k8s";
import { cn } from "@/lib/utils";
import { CheckIcon, CrossIcon, QuestionIcon } from "@/components/icons";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Model',
}

export default async function Page({ params }: { params: { id: string } }) {
  const model = await fetchModel(parseInt(params.id))

  if (!model) {
    return notFound()
  }

  const modelStatus = await getModelStatus(model.name)

  return (
    <>
      <Link
        href="/model"
        className="group transition-colors hover:border-neutral-800 rounded-lg  hover:dark:bg-neutral-800/30"
      >
        <h2 className={`mb-3 font-semibold`}>
          <span className="inline-block transition-transform group-hover:-translate-x-1 ">
            {"<-"}
          </span>
          {" "}Back to Model List
        </h2>
      </Link>
      <h1 className="text-3xl font-extrabold flex space-x-2">
        <Square3Stack3DIcon className="w-6" />
        <span>{model.name}</span>
      </h1>
      <div>
        <div className="text-sm space-x-4">
          <Button asChild variant="link">
            <Link href={'/model/edit/' + model.id + "?a"}><span className="text-blue-600">Edit</span></Link>
          </Button>
          <Button asChild variant="link">
            <Link href={'/model/delete/' + model.id + "?a"} ><span className=" text-red-600">Delete</span></Link>
          </Button>
        </div>
      </div>
      <div className={cn(
        "border-[1px] rounded-lg p-4 text-sm",
        {
          'border-green-500 text-green-500 bg-green-50': (modelStatus as any)?.status?.state === "Running",
          'border-yellow-500 text-yellow-500 bg-yellow-50': (modelStatus as any)?.status?.state === "Unknown",
          'border-red-500 text-red-500 bg-red-50': (modelStatus as any)?.status?.state === "Failed",
        }
        )}>
        <h2 className="font-bold text-lg">
          {
            (modelStatus as any)?.status?.state === "Running" ?
              <CheckIcon className="fill-current w-4 h-4 inline-block mr-2 mb-[1px]"></CheckIcon> :
              (modelStatus as any)?.status?.state === "Failed" ?
                <CrossIcon className="fill-current w-4 h-4 inline-block mr-2 mb-[1px]"></CrossIcon>:
                <QuestionIcon className="fill-current w-4 h-4 inline-block mr-2 mb-[1px]"></QuestionIcon>
          }
          {(modelStatus as any)?.status?.state || "Unknown"}
        </h2>
        <p>{(modelStatus as any)?.status?.message}</p>
      </div>

      <Card className="group">
        <CardContent className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <p className="text-xs text-neutral-600 pt-2">{model.type}</p>
            </div>

            <div>
              <Label>Model Name</Label>
              <p className="text-xs text-neutral-600 pt-2">{model.modelName}</p>
            </div>

            <div>
              <Label>Maximum number of processes</Label>
              <p className="text-xs text-neutral-600 pt-2">{model.maxProcesses}</p>
            </div>

            {model.type === 'remote' ?
              (
                <>
                  <div>
                    <Label>Base URL</Label>
                    <p className="text-xs text-neutral-600 pt-2">{model.baseUrl}</p>
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <p className="text-xs text-neutral-600 pt-2">{model.apiToken}</p>
                  </div>
                </>
              ) : null}
          </div>
        </CardContent>
      </Card >
    </>
  )
}
