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
        <header className="flex items-center h-16 gap-1 border-b">
          <div className="flex items-center">
            <Button asChild variant="ghost" className='py-4 text-xl'>
              <Link href="/">
                Admin
              </Link>
            </Button>
          </div>
          <span>/</span>
          <div className="flex items-center">
            <Button asChild variant="ghost" className='py-4 text-xl'>
              <Link href="/model">
                Model
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
