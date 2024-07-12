'use client';

import { useRouter } from "next/navigation";
import Link from "next/link"
import { addModel } from "../api/models"
import { useState } from "react";

import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Page() {

  const router = useRouter()

  const [type, setType] = useState<"remote" | "local">("local")

  return (<>
    <Link
      href="/model"
      className="group transition-colors hover:border-neutral-800 rounded-lg  hover:dark:bg-neutral-800/30"
    >
      <h2 className={`mb-3 font-semibold`}>
        <span className="inline-block transition-transform group-hover:-translate-x-1 ">
          {"<- "}
        </span>
        {" "}Back to AI Model List
      </h2>
    </Link>
    <Card>
      <CardHeader>
        <CardTitle>Add New AI Model</CardTitle>
        <CardDescription>Enter the details for the new model.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={async (formdata: FormData) => {
          try {
            const maxProcesses = formdata.get("maxprocesses") as string
            const newmodel = await addModel({
              type: formdata.get("type") as string,
              name: formdata.get("name") as string,
              modelName: formdata.get("aimodelname") as string,
              baseUrl: formdata.get("baseurl") as string || undefined,
              apiToken: formdata.get("apitoken") as string || undefined,
              maxProcesses: maxProcesses ? (parseInt(maxProcesses) || undefined) : undefined
            })
            router.push("/model/model/" + newmodel.id.toString())
          } catch (e: any) {
            console.error(e)
            toast.error(e.toString())
          }
        }}
        >
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="model-name">Name <span className="text-red-400">*</span></Label>
              <Input id="model-name" name='name' required placeholder="A custom name"></Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-maxprocesses">Maximum number of processes</Label>
              <Input id="model-maxprocesses" name='maxprocesses' placeholder="Maximum number of requests the model can handle at the same time"></Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-aimodelname">AI Model Name <span className="text-red-400">*</span></Label>
              <Input id="model-aimodelname" name='aimodelname' required placeholder="gpt-3.5-turbo"></Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-type">Type <span className="text-red-400">*</span></Label>
              <Select name='type' required value={type} onValueChange={(e: 'local' | 'remote') => setType(e)}>
                <SelectTrigger>
                  <SelectValue>{type}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="local">local</SelectItem>
                    <SelectItem value="remote">remote</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {type === 'remote' ? (<>
              <div className="space-y-2">
                <Label htmlFor="model-baseurl">Base URL <span className="text-red-400">*</span></Label>
                <Input id="model-baseurl" name='baseurl' required placeholder="https://api.openai.com"></Input>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model-apitoken">API Token <span className="text-red-400">*</span></Label>
                <Input id="model-apitoken" name='apitoken' required placeholder="sk-xxxxxxxx"></Input>
              </div>
            </>) : null}
          </div>
          <Button type="submit" className=" mt-4">Save Model</Button>
        </form>
      </CardContent>
    </Card>
  </>)
}
