import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import {
  Dialog as ShadcnDialog,
  DialogClose as ShadcnDialogClose,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger as ShadcnDialogTrigger,
} from "@/components/ui/dialog"

const Dialog = ShadcnDialog

const DialogTrigger = ShadcnDialogTrigger

const DialogHeader = ShadcnDialogHeader

const DialogDescription = ShadcnDialogDescription

const DialogClose = ShadcnDialogClose

const DialogFooter = ShadcnDialogFooter

function DialogTitle({
  ...props
}) {
  const { className, font } = props
  return (
    <ShadcnDialogTitle
      className={cn(font !== "normal" && "font-brand", className)}
      {...props} />
  );
}

export const dialogContentVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "font-brand",
    },
  },
  defaultVariants: {
    font: "retro",
  },
})

function DialogContent({
  className,
  children,
  font,
  ...props
}) {
  return (
    <ShadcnDialogContent
      className={cn(
        "bg-card rounded-none border-none",
        dialogContentVariants({ font }),
        className
      )}
      {...props}>
      {children}
      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
      <div
        className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true" />
    </ShadcnDialogContent>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogClose,
}
