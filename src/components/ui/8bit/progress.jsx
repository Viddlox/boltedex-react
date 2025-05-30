import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

export const progressVariants = cva("", {
  variants: {
    variant: {
      default: "",
      retro: "font-brand",
    },
    font: {
      normal: "font-sans",
      retro: "font-brand",
    },
  },
  defaultVariants: {
    font: "retro",
  },
})

function Progress({
  ...props
}) {
  const { className, font } = props

  return (
    <div className={cn("relative w-full", className)}>
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          "bg-primary/20 relative h-2 w-full overflow-hidden",
          progressVariants({ font }),
          className
        )}
        {...props}>
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full transition-all",
            props.variant === "retro" ? "flex" : "bg-primary w-full flex-1"
          )}
          style={
            props.variant === "retro"
              ? undefined
              : { transform: `translateX(-${100 - (props.value || 0)}%)` }
          }>
          {props.variant === "retro" && (
            <div className="flex w-full">
              {Array.from({ length: 20 }).map((_, i) => {
                const filledSquares = Math.round(((props.value || 0) / 100) * 20)
                return (
                  <div
                    key={i}
                    className={cn(
                      "size-2 mx-[1px] w-full",
                      i < filledSquares ? "bg-primary" : "bg-transparent"
                    )} />
                );
              })}
            </div>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
      <div
        className="absolute inset-0 border-y-4 -my-1 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
      <div
        className="absolute inset-0 border-x-4 -mx-1 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
    </div>
  );
}

export { Progress }
