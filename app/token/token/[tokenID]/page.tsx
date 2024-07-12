import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import Link from "next/link"
import { fetchToken } from "../../api/tokens"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";


export const metadata = {
    title: 'Token',
}

export default async function Page({ params }: { params: { tokenID: string } }) {
    const token = await fetchToken(parseInt(params.tokenID))

    if (!token) {
      return notFound()
    }

    return (
        <>
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
            <Card className="group">
                <CardHeader>
                  <Label>Description</Label>
                    <CardDescription>{token.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    </div>

                    <div>
                        <Label>Scope</Label>
                        {token.allowedModels ?
                            (<div className="flex space-x-2 pt-2 px-3">
                                {token.allowedModels.map((scope: string, index: number) => (
                                    <Badge key={index}>{scope}</Badge>
                                ))}
                            </div>)
                            : <p className="text-neutral-600 text-xs pt-2">No scope</p>
                        }
                    </div>

                </CardContent>
            </Card >
        </>
    )
}
