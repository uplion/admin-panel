import { deleteModel, fetchModel } from "../../api/models";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Square3Stack3DIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: Record<string, string> }) {
  const model = await fetchModel(parseInt(params.id))

  if (!model) {
    return notFound()
  }

  async function deleteModelnHandler() {
    'use server';
    await deleteModel(parseInt(params.id))
    redirect('/model')
  }
  return (<>
    <Card className="group">
      <CardHeader>
        <CardTitle className="text-2xl">
          Are you sure you want to delete model
          `<HoverCard>
            <HoverCardTrigger asChild>
              <Link href={'/model/model/' + model.id} className="text-blue-700 hover:text-blue-400 group-hover:border-blue-700 group-hover:hover:border-blue-400 border-b-2">{model.name}</Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="font-semibold flex space-x-2">
                    <Square3Stack3DIcon className="w-4" />
                    <span>{model.name}</span>
                  </h4>
                  <p className="text-sm">
                    {model.type}.{model.modelName}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>`?

        </CardTitle>
        <CardDescription>
          This action is irreversible and may affect existing programs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={deleteModelnHandler} className="space-x-2">
          <Button asChild variant="outline">
            <Link href={
              Object.hasOwn(searchParams, "a") ? "/model/model/" + model.id : "/model"
            }>Cancel</Link>
          </Button>
          <Button variant="destructive" type='submit'>
            Delete
          </Button>
        </form>
      </CardContent>
    </Card>
  </>)
}
