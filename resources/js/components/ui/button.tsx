import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-emerald-400/40 bg-emerald-100 text-emerald-700 ring-inset ring-emerald-300/50 hover:ring-1 hover:ring-emerald-400/70 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/40 dark:hover:ring-emerald-400/70 active:scale-95",
        destructive:
          "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-out bg-pink-100 text-pink-700 ring-1 ring-inset ring-pink-300/50 hover:ring-2 hover:ring-pink-400/70 active:scale-95 dark:bg-pink-900/30 dark:text-pink-300 dark:ring-pink-500/40 dark:hover:ring-pink-400/70",
        outline:
          "border border-gray-300 bg-background shadow-xs ring-inset ring-gray-300/50 hover:ring-1 hover:ring-gray-400/70 hover:bg-accent hover:text-accent-foreground hover:border-foreground/40 active:scale-95 dark:bg-gray-400/10 dark:border-gray-200/20 dark:hover:bg-muted dark:hover:border-gray-300/30",
        secondary:
          "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-out bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-300/50 hover:ring-2 hover:ring-yellow-400/70 active:scale-95 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/40 dark:hover:ring-yellow-400/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
