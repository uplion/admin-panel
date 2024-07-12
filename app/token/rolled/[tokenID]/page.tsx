import { Button } from "@/components/ui/button"
import { CardContent, Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link";
import { rollToken } from "../../api/tokens";
import { Result } from "@/components/token/result";

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { tokenID: string } }) {
    const token = await rollToken(parseInt(params.tokenID))
    return (<>
        <Card>
            <CardHeader>
                <CardTitle>Token was successfully rolled</CardTitle>
                <CardDescription>
                    This will not be shown again.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Result token={token} />
            </CardContent>
            <CardFooter className="space-x-2">
                <Button asChild variant="outline">
                    <Link href="/token">
                        Token List
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={"/token/token/" + params.tokenID}>
                        See Token
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </>)
}
