import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { Label as ShadcnLabel } from "@/components/ui/label"


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

function Label({
  className,
  font,
  ...props
}) {
  return (
    <ShadcnLabel
      className={cn(className, inputVariants({ font }))}
      {...props} />
  );
}

export { Label }
