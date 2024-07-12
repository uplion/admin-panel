"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ onDateChange, defaultDate }: { onDateChange: (date: Date | undefined) => void, defaultDate?: Date }) {
    const [date, setDate] = React.useState<Date | undefined>(defaultDate)
    function handleDateChange(date: Date | undefined) {
        setDate(date)
        onDateChange(date)
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-1/2 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    fromDate={new Date()}
                    onSelect={(date) => handleDateChange(date)}
                    initialFocus

                />
            </PopoverContent>
        </Popover>
    )
}
