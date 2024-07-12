'use client';

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Result({ token }: { token: string }) {

  const [copyText, setCopyText] = useState("Copy")

  return (<div className="ml-3">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="group inline-block cursor-pointer relative"
            onClick={() => {
              navigator.clipboard.writeText(token)
              setCopyText("Copied")
              setTimeout(() => setCopyText("Copy"), 1000)
            }}>
            <code
              className='inline-block h-[42px] bg-slate-100 py-[6.5px] px-1 rounded-lg border-dotted border-black border-2 group-hover:border-green-600 group-hover:border-solid
                 rounded-r-none transition-colors mr-0 text-lg'
            >
              {token}
            </code>
            <span className="absolute text-lg font-mono inline-block h-[42px] select-none  border-l-0 border-black border-2 rounded-lg rounded-l-none py-[5px] px-1 group-hover:border-green-600 transition-colors ">{copyText}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>)
}
