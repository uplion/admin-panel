import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';



export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='p-5 w-[1000px] max-w-full mx-auto'>
            <div className="flex flex-col w-full">
                <header className="flex items-center h-14 gap-2 border-b px-6">
                    <div className="flex items-center">
                        <Package2Icon className="h-6 w-6" />
                        <Button asChild variant="link">
                            <Link href="/token">
                                Token Management
                            </Link>
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-4 grid gap-4">
                    {children}
                </main>
            </div>
        </div>
    );
}


function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    )
}
