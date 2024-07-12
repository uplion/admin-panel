import { useRef, useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";



export function AIModelsInput({
  onPathChange,
  defaultValue
} : {
  onPathChange : (paths: string[]) => void,
  defaultValue?: string[]
}) {
  const [paths, setPaths] = useState<string[]>(defaultValue || [])
  const inputRef = useRef<HTMLInputElement>(null)
  const path = useRef<string>("")
  const handlePathChange = () => {
    if (!path.current) {
      return
    }
    const newPath = [...paths, path.current]
    setPaths(newPath)
    inputRef.current && (inputRef.current.value = "")
    onPathChange(newPath)
  }
  return (
    <div className="space-y-4">
      {paths.map((path, index) => (
        <div key={index}>
          <div className="flex my-1">
            <Input id="path" className="rounded-r-none" disabled style={{ cursor: "default" }} defaultValue={path}/>
            <Button type='button' size="icon" variant="destructive" className="rounded-l-none" onClick={() => {
              const newPath = paths.filter((_, i) => i !== index)
              setPaths(newPath)
              onPathChange(newPath)
            }}>
              <TrashIcon className="w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="w-full">
        <div className="flex">
          <Input
            id="path"
            ref={inputRef}
            placeholder="gpt-3.5-turbo"
            className="rounded-r-none"
            onChange={(e) => {path.current = e.target.value}}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (path.current) {
                  handlePathChange()
                  e.preventDefault()
                }
              }
            }}
          />
          <Button type="button" className="rounded-l-none" size="icon" onClick={() => handlePathChange()}>
            <PlusIcon className="w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
