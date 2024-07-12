import { notFound } from "next/navigation";
import { fetchToken } from "../../api/tokens";
import { Edit } from "./edit";


export default async function Page({ params } : { params: { tokenID: string }}) {
    const token = await fetchToken(parseInt(params.tokenID))

    if (!token) {
      return notFound()
    }

    return (<Edit token={token}/>)
}
