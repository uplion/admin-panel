'use client';

import { useRouter } from "next/navigation";
import Link from "next/link"
import { AddTokenType, addToken } from "../api/tokens"
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Result } from "@/components/token/result";
import { Switch } from "@/components/ui/switch"
import { AIModelsInput } from "@/components/path-input/input";
import { toast } from "sonner"
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker";


export default function Page() {
    const [token, setToken] = useState("")
    const router = useRouter()
    const [scope, setScope] = useState(false)
    const [statistics, setStatistics] = useState(false)
    const [custom, setCustom] = useState(false)
    const [customDate, setCustomDate] = useState<Date | undefined>(undefined)
    const paths = useRef<string[]>([])

    return token ?
        (<>
            <Card>
                <CardHeader>
                    <CardTitle>Token was successfully created</CardTitle>
                    <CardDescription>
                        This will not be shown again.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Result token={token} />
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href="/token">
                            Token List
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </>)
        :
        (<>
            <Link
                href="/token"
                className="group transition-colors hover:border-neutral-800 rounded-lg  hover:dark:bg-neutral-800/30"
            >
                <h2 className={`mb-3 font-semibold`}>
                    <span className="inline-block transition-transform group-hover:-translate-x-1 ">
                        {"<- "}
                    </span>
                    {" "}Back to Token List
                </h2>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Add New Token</CardTitle>
                    <CardDescription>Enter the details for the new token.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={async (formdata: FormData) => {
                        const data: AddTokenType = {
                            name: formdata.get("name") as string || "",
                            description: formdata.get("description") as string || "",
                            expiresAt: undefined,
                            isQuotaLimited: true
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
                            if (paths.current.length === 0) {
                                toast.error("Please enter at least one path.")
                                return
                            }
                            data.allowedModels = paths.current
                        }
                        try {
                            setToken(await addToken(data))
                        } catch (e: any) {
                            console.error(e)
                            toast.error(e.toString())
                        }
                    }}>
                        <div className="space-y-2">
                            <Label htmlFor="token-name">Name</Label>
                            <Input id="token-name" placeholder="Enter token name" name='name' required />
                        </div>
                        <div className="space-y-2 my-2">
                            <Label htmlFor="token-description">Description</Label>
                            <Textarea id="token-description" name='description' placeholder="Enter token description" />
                        </div>
                        <div className="space-y-2 my-2">
                            <h2 className=" font-medium text-sm mt-2">Expiration</h2>
                            <div className="flex flex-row space-x-2">
                                <Select name="expiration" defaultValue="never" onValueChange={e => {
                                    if (e === "custom") setCustomDate(undefined)
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
                                    <DatePicker onDateChange={(date) => {
                                        setCustomDate(date)
                                    }} />
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
                                    <Switch id="open-scope" name='scope' defaultValue={'off'} onCheckedChange={(e: boolean) => setScope(e)} />
                                </div>
                            </div>

                            {scope && (
                                <>
                                    <div className="pb-2">
                                        <AIModelsInput
                                            onPathChange={e => {
                                                paths.current = e
                                            }}
                                            defaultValue={paths.current}
                                        />
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
