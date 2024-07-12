'use client';

import { Token } from '@/lib/prisma'
import { CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { updateEnable } from '../../api/tokens';
import { toast } from 'sonner';

export function TokenView({ token }: { token: Token }) {
  return (
    <>
      <Link
        href="/token"
        className="group transition-colors hover:border-neutral-800 rounded-lg  hover:dark:bg-neutral-800/30"
      >
        <h2 className={`mb-3 font-semibold`}>
          <span className="inline-block transition-transform group-hover:-translate-x-1 ">
            {"<-"}
          </span>
          {" "}Back to Token List
        </h2>
      </Link>
      <h1 className="text-3xl font-extrabold flex space-x-2">
        <LockClosedIcon className="w-6" />
        <span>{token.name}</span>
      </h1>
      <div>
        <div className="text-sm space-x-4">
          <Button asChild variant="link">
            <Link href={'/token/roll/' + token.id + "?a"}>Roll</Link>
          </Button>
          <Button asChild variant="link">
            <Link href={'/token/edit/' + token.id + "?a"}><span className="text-blue-600">Edit</span></Link>
          </Button>
          <Button asChild variant="link">
            <Link href={'/token/delete/' + token.id + "?a"} ><span className=" text-red-600">Delete</span></Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="space-y-4 mt-6 flex justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="open-scope">Enable</Label>
            <div className="text-xs">
              <p className="text-neutral-600">Enable or disable this token temporarily</p>
            </div>
          </div>
          <div>
            <Switch id="enable" name='enable' defaultChecked={token.isEnabled} onCheckedChange={async () => {
              await updateEnable(token.id, !token.isEnabled)
              toast.success(token.isEnabled ? "Token disabled" : "Token enabled")
              token.isEnabled = !token.isEnabled
            }} />
          </div>
        </CardContent>
      </Card>
      <Card className="group">
        <CardContent className="space-y-4 mt-6">

          <div>
            <Label>Description</Label>
            <p className="text-xs text-neutral-600 pt-2">{token.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">


            <div>
              <Label>Created At</Label>
              <p className="text-xs text-neutral-600 pt-2">{token.createdAt.toLocaleString("zh-cn")}</p>
            </div>

            <div>
              <Label>Expiration</Label>
              <p className="text-xs text-neutral-600 pt-2">
                {token.expiresAt ? token.expiresAt.toLocaleString("zh-cn") : "Never"}
              </p>
            </div>

            <div>
              <Label>Remaining tokens</Label>
              <p className="text-xs text-neutral-600 pt-2">
                {token.isQuotaLimited ? token.remainingTokens : "No limit"}
              </p>
            </div>
          </div>

          <div>
            <Label>Scope</Label>
            {token.allowedModels.length > 0 ?
              (<div className="flex space-x-2 pt-2 px-3">
                {token.allowedModels.map((scope: string, index: number) => (
                  <Badge key={index}>{scope}</Badge>
                ))}
              </div>)
              : <p className="text-neutral-600 text-xs pt-2">
                No limit
              </p>
            }
          </div>

        </CardContent>
      </Card >
    </>
  )
}
