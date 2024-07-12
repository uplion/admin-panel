import { deleteToken, fetchToken } from "../../api/tokens";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { LockClosedIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params, searchParams }: { params: { tokenID: string }, searchParams: Record<string, string> }) {
    const token = await fetchToken(parseInt(params.tokenID))

    if (!token) {
      return notFound()
    }

    async function deleteTokenHandler() {
        'use server';
        await deleteToken(parseInt(params.tokenID))
        redirect('/token')
    }
    return (<>
        <Card className="group">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Are you sure you want to delete token
                    `<HoverCard>
                        <HoverCardTrigger asChild>
                            <Link href={'/token/token/' + token.id} className="text-blue-700 hover:text-blue-400 group-hover:border-blue-700 group-hover:hover:border-blue-400 border-b-2">{token.name}</Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                                <div className="space-y-1">
                                    <h4 className="font-semibold flex space-x-2">
                                        <LockClosedIcon className="w-4" />
                                        <span>{token.name}</span>
                                    </h4>
                                    <p className="text-sm">
                                        {token.description}
                                    </p>
                                    <div className="flex items-center pt-2">
                                        <span className="text-xs text-muted-foreground text-neutral-500">
                                            Created at {token.createdAt.toLocaleString("zh-cn")}
                                        </span>
                                    </div>
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
                <form action={deleteTokenHandler}  className="space-x-2">
                    <Button asChild variant="outline">
                        <Link href={
                            Object.hasOwn(searchParams, "a") ? "/token/token/" + token.id : "/token"
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
