import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { Input as ShadcnInput } from "@/components/ui/input"

export const inputVariants = cva("", {
  variants: {
    font: {
      normal: "font-sans",
      retro: "font-brand",
    },
  },
  defaultVariants: {
    font: "retro",
  },
})


function Input({
  ...props
}) {
  const { className, font } = props

  return (
    <div
      className={cn(
        "relative border-y-6 border-foreground dark:border-ring !p-0 flex items-center",
        className
      )}>
      <ShadcnInput
        {...props}
        className={cn(
          "rounded-none ring-0 !w-full",
          inputVariants({ font }),
          className
        )} />
      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
    </div>
  );
}

export { Input }
