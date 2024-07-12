import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Add Token'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        {children}
    </>
  )
}
