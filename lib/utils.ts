import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function validName(name: string) {
  if (name.length > 253) {
    return 'Input must be no more than 253 characters long.'
  }

  const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]+[a-zA-Z0-9])?$/;

  if (!regex.test(name)) {
    return "Input can only contain uppercase and lowercase letters, numbers, and hyphens, cannot start or end with a hyphen"
  } else {
    return ''
  }
}
