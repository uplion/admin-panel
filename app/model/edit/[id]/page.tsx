import { notFound } from "next/navigation";
import { fetchModel } from "../../api/models";
import { Edit } from "./edit";


export default async function Page({ params }: { params: { id: string } }) {
  const model = await fetchModel(parseInt(params.id))

  if (!model) {
    return notFound()
  }

  return (<Edit model={model} />)
}
