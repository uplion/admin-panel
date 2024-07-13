import { fetchModels } from "@/app/model/api/models"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { CardContent, Card } from "@/components/ui/card"
import Link from "next/link";

export const dynamic = 'force-dynamic'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getModelsStatus } from "@/lib/k8s";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

export async function Models() {
  const [models, modelStatus] = await Promise.all([fetchModels(), getModelsStatus()])

  const statusMap = new Map<string, {
    state: string,
    message: string
  }>()

  for (const status of (modelStatus as any).items) {
    statusMap.set(status.metadata.name, {
      state: status.status.state,
      message: status.status.message
    })
  }

  return models.length ? (
    <>
      <Card>
        <CardContent className="p-0">
          <Table className="max-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Model Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="w-24 md:w-48">
                  <span className="hidden md:inline">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model: any) => (
                <TableRow key={model.id}>
                  <TableCell className="group">
                    <div className="font-semibold">
                      <Link
                        href={"/model/model/" + model.id}
                        className="border-b-[1px] border-transparent group-hover:border-black transition-colors"
                      >
                        {model.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="group">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={"/model/model/" + model.id} className={cn(
                            "border-b-[1px] border-transparent transition-colors font-bold",
                            {
                              "group-hover:border-green-700 text-green-700": statusMap.get(model.name + "-ai-model")?.state === "Running",
                              "group-hover:border-red-700 text-red-700 ": statusMap.get(model.name + "-ai-model")?.state === "Failed",
                              "group-hover:border-yellow-700 text-yellow-700": statusMap.get(model.name + "-ai-model")?.state === "Unknown",
                            }
                          )}>
                            { statusMap.get(model.name + "-ai-model")?.state || "Unknown" }
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{ statusMap.get(model.name + "-ai-model")?.message || "Unknown" }</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{model.modelName}</TableCell>
                  <TableCell className="hidden md:table-cell">{model.type}</TableCell>
                  <TableCell>
                    <div className="items-center space-x-2 hidden md:flex">
                      <Button size="sm" asChild variant="link" className="text-blue-600 hover:text-blue-500">
                        <Link href={"/model/edit/" + model.id}>Edit</Link>
                      </Button>
                      <Button size="sm" asChild variant="link" className="text-red-500 hover:text-red-400">
                        <Link href={"/model/delete/" + model.id}>Delete</Link>
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="md:hidden">
                        <Button variant="ghost">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Link href={"/model/model/" + model.id}>Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={"/model/edit/" + model.id}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={"/model/delete/" + model.id} className="text-red-500">Delete</Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  ) : (
    <div className="text-center py-6">
      <p className="text-neutral-500">No AI model found.</p>
    </div>
  )
}


export async function ModelsSkeleton() {
  const PlaceHolder = ({ className }: { className?: string }) => (<TableCell>
    <span className={`h-5 rounded-lg bg-slate-200 inline-block animate-pulse ` + (className || '')}></span>
  </TableCell>)
  const l = (key: number) => (<TableRow key={key}>
    <PlaceHolder className="w-full"></PlaceHolder>
    <PlaceHolder className="w-full"></PlaceHolder>
    <PlaceHolder className="w-full hidden sm:block"></PlaceHolder>
    <PlaceHolder className="w-full hidden md:block"></PlaceHolder>
    <PlaceHolder className="w-full hidden md:block"></PlaceHolder>
  </TableRow>)
  const x = []
  for (let i = 1; i <= 5; i++) x.push(l(i))

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Model Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="w-24 md:w-48">
                <span className="hidden md:inline">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {x}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

