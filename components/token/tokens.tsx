import { fetchTokens } from "@/app/token/api/tokens"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { CardContent, Card } from "@/components/ui/card"
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export async function Tokens() {
    const tokens = await fetchTokens()

    return tokens.length ? (
        <>
            <Card>
                <CardContent className="p-0">
                    <Table className="max-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Description</TableHead>
                                <TableHead className="hidden md:table-cell w-48">Created At</TableHead>
                                <TableHead className="w-24 md:w-48">
                                    <span className="hidden md:inline">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tokens.map((token) => (
                                <TableRow key={token.id}>
                                    <TableCell className="group">
                                        <div className="font-semibold">
                                            <Link
                                                href={"/token/token/" + token.id}
                                                className="border-b-[1px] border-transparent group-hover:border-black transition-colors"
                                            >
                                                {token.name}
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{token.description}</TableCell>
                                    <TableCell className="hidden md:table-cell">{token.createdAt.toLocaleString("zh-cn")}</TableCell>
                                    <TableCell>
                                        <div className="items-center space-x-2 hidden md:flex">
                                            <Button size="sm" asChild variant="link" className="hover:text-zinc-700">
                                                <Link href={"/token/roll/" + token.id}>Roll</Link>
                                            </Button>
                                            <Button size="sm" asChild variant="link" className="text-blue-600 hover:text-blue-500">
                                                <Link href={"/token/edit/" + token.id}>Edit</Link>
                                            </Button>
                                            <Button size="sm" asChild variant="link" className="text-red-500 hover:text-red-400">
                                                <Link href={"/token/delete/" + token.id}>Delete</Link>
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
                                                        <Link href={"/token/token/" + token.id}>Details</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href={"/token/roll/" + token.id}>Roll</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href={"/token/edit/" + token.id}>Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link href={"/token/delete/" + token.id} className="text-red-500">Delete</Link>
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
            <p className="text-neutral-500">No token found.</p>
        </div>
    )
}


export async function TokensSkeleton() {
    const PlaceHolder = ({ className }: { className: string }) => (<TableCell>
        <span className={`h-5 rounded-lg bg-slate-200 inline-block ` + className}></span>
    </TableCell>)
    const l = (key: number) => (<TableRow key={key}>
        <PlaceHolder className="w-[150px]"></PlaceHolder>
        <PlaceHolder className="w-[300px]"></PlaceHolder>
        <PlaceHolder className="w-[100px]"></PlaceHolder>
        <PlaceHolder className="w-[100px]"></PlaceHolder>
    </TableRow>)
    const x = []
    for (let i = 1; i <= 5; i++) x.push(l(i))

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">Date Added</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="animate-pulse">
                {x}
            </TableBody>
        </Table>
    )
}
