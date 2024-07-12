import { fetchToken } from "../../api/tokens"
import { notFound } from "next/navigation";
import { TokenView } from "./token";


export const metadata = {
  title: 'Token',
}

export default async function Page({ params }: { params: { tokenID: string } }) {
  const token = await fetchToken(parseInt(params.tokenID))

  if (!token) {
    return notFound()
  }

  return <TokenView token={token} />
}
