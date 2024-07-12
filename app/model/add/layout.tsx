import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Add Model'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
