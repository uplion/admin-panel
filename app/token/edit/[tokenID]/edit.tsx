
'use client';

import Link from "next/link"
import { AddTokenType, editToken } from "../../api/tokens"
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AIModelsInput } from "@/components/path-input/input";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { Token } from "@/lib/prisma";

export function Edit({ token }: { token: Omit<Token, "value"> }) {
  const router = useRouter()
  const [scope, setScope] = useState(token.allowedModels.length > 0)
  const [quota, setQuota] = useState(token.isQuotaLimited)
  const [custom, setCustom] = useState(token.expiresAt !== null)
  const [customDate, setCustomDate] = useState<Date | null>(token.expiresAt)
  const models = useRef<string[]>(token.allowedModels)
  const toAdmin = !useSearchParams().has("a")

  return (<>
    <Link
      href={toAdmin ? "/token" : "/token/token/" + token.id}
      className="group transition-colors hover:border-neutral-800 rounded-lg  hover:dark:bg-neutral-800/30"
    >
      <h2 className={`mb-3 font-semibold`}>
        <span className="inline-block transition-transform group-hover:-translate-x-1 ">
          {"<- "}
        </span>
        {toAdmin ? " Back to Token List" : " Back to Token `" + token.name + "`"}
      </h2>
    </Link>
    <Card>
      <CardHeader>
        <CardTitle>Edit Token</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={async (formdata: FormData) => {
          const data: AddTokenType = {
            name: formdata.get("name") as string || "",
            description: formdata.get("description") as string || "",
            allowedModels: [],
            isQuotaLimited: quota,
            remainingTokens: parseInt(formdata.get("quota") as string || "0")
          }
          const expiration = formdata.get("expiration") as string
          if (expiration === "custom") {
            if (customDate)
              data.expiresAt = customDate
            else {
              toast.error("Please select a date.")
              return
            }
          } else if (expiration === "never") {
            data.expiresAt = undefined
          } else if (expiration === '30d') {
            data.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          } else if (expiration === '90d') {
            data.expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          } else if (expiration === '1y') {
            data.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          } else if (expiration === '2y') {
            data.expiresAt = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000)
          } else {
            toast.error("Invalid expiration.")
            return
          }
          if (scope) {
            if (models.current.length === 0) {
              toast.error("Please enter at least one AI model.")
              return
            }
            data.allowedModels = models.current
          }
          try {
            await editToken(token.id, data)
            toast.success("Token updated.")
            router.push('/token/token/' + token.id.toString())
          } catch (e: any) {
            console.error(e)
            toast.error(e.toString())
          }
        }}>
          <div className="space-y-2">
            <Label htmlFor="token-name">Name</Label>
            <Input id="token-name" placeholder="Enter token name" name='name' required defaultValue={token?.name} />
          </div>
          <div className="space-y-2 my-2">
            <Label htmlFor="token-description">Description</Label>
            <Textarea id="token-description" name='description' placeholder="Enter token description" defaultValue={token?.description || undefined} />
          </div>
          <div className="space-y-2 my-2">
            <h2 className=" font-medium text-sm mt-2">Expiration</h2>
            <div className="flex flex-row space-x-2">
              <Select name="expiration" defaultValue={custom ? "custom" : "never"} onValueChange={e => {
                if (e === "custom") setCustomDate(null)
                setCustom(e === "custom")
              }}
              >
                <SelectTrigger className="w-1/2" >
                  <SelectValue placeholder="Select a expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="never" defaultChecked>never</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="1y">1 year</SelectItem>
                    <SelectItem value="2y">2 years</SelectItem>
                    <SelectItem value="custom">custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {custom && (
                <DatePicker
                  onDateChange={(date) => {
                    setCustomDate(date || null)
                  }}
                  defaultDate={customDate || undefined}
                />
              )}
            </div>
          </div>
          <div className="space-y-2 my-2">
            <h2 className=" font-medium text-sm mt-2">Scope</h2>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="open-scope">Turn on scope restrictions</Label>
                <div className="text-xs">
                  <p className="text-neutral-600">When turned on, you can restrict the token to specific AI models.</p>
                </div>
              </div>
              <div>
                <Switch id="open-scope" name='scope' defaultChecked={scope} onCheckedChange={(e: boolean) => setScope(e)} />
              </div>
            </div>

            {scope && (
              <>
                <div className="pb-2">
                  <AIModelsInput
                    onPathChange={e => {
                      models.current = e
                    }}
                    defaultValue={models.current}
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2 my-2">
            <h2 className=" font-medium text-sm mt-2">Quota</h2>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="open-scope">Turn on quota restrictions</Label>
                <div className="text-xs">
                  <p className="text-neutral-600">When turned on, you can limit the amount of this token can be used.</p>
                </div>
              </div>
              <div>
                <Switch id="open-quota" defaultChecked={quota} onCheckedChange={(e: boolean) => setQuota(e)} />
              </div>
            </div>

            {quota && (
              <>
                <div className="pb-2">
                  <Input id="quota" name='quota' inputMode="numeric" min={0} step={1} defaultValue={0} required />
                </div>
              </>
            )}
          </div>
          <Button type="submit" className="mt-5">Save Token</Button>
        </form>
      </CardContent>
    </Card>
  </>)
}
