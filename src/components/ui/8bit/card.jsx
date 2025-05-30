import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import {
  Card as ShadcnCard,
  CardAction as ShadcnCardAction,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/components/ui/card"

export const cardVariants = cva("", {
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

function Card({
  ...props
}) {
  const { className, font } = props

  return (
    <div className={cn("relative group", className)}>
      {/* Main card container with isometric beveled effect */}
      <div className="relative">
        {/* Bottom shadow layer (darkest) */}
        <div 
          className="absolute top-2 left-2 w-full h-full bg-foreground/40 rounded-none"
          aria-hidden="true" 
        />

        {/* Middle shadow layer */}
        <div 
          className="absolute top-1 left-1 w-full h-full bg-foreground/25 rounded-none"
          aria-hidden="true" 
        />

        {/* Main card */}
        <div className="relative">
          <ShadcnCard
            {...props}
            className={cn(
              "rounded-none border-0 !w-full relative",
              "border-t-4 border-l-4 border-white/80", // Top-left bevel (light)
              "border-r-4 border-b-4 border-foreground/60", // Bottom-right bevel (dark)
              cardVariants({ font }),
              className
            )} 
          />

          {/* Outer light outline (top-left) */}
          <div
            className="absolute -inset-1 border-t-2 border-l-2 border-white/60 pointer-events-none rounded-none"
            aria-hidden="true" 
          />

          {/* Outer dark outline (bottom-right) */}
          <div
            className="absolute -inset-1 border-r-2 border-b-2 border-foreground/40 pointer-events-none rounded-none"
            aria-hidden="true" 
          />

          {/* Inner accent outline */}
          <div
            className="absolute inset-1 border-t border-l border-white/40 border-r border-b border-foreground/30 pointer-events-none rounded-none"
            aria-hidden="true" 
          />
        </div>
      </div>
    </div>
  );
}

function CardHeader({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardHeader
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

function CardTitle({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardTitle
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

function CardDescription({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardDescription
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

function CardAction({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardAction
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

function CardContent({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardContent
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

function CardFooter({
  ...props
}) {
  const { className, font } = props

  return (
    <ShadcnCardFooter
      data-slot="card-footer"
      className={cn(cardVariants({ font }), className)}
      {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}