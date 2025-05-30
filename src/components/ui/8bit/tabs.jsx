import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import {
  Tabs as ShadcnTabs,
  TabsContent as ShadcnTabsContent,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
} from "@/components/ui/tabs"

export const tabsVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary",
      retro: "font-brand",
    },
    font: {
      normal: "",
      retro: "font-brand",
    },
  },
  defaultVariants: {
    font: "retro",
  },
})

function Tabs({
  className,
  ...props
}) {
  const { font, variant } = props

  return (
    <ShadcnTabs
      {...props}
      className={cn("relative retro-tabs", tabsVariants({ font, variant }), className)} />
  );
}

function TabsList({
  className,
  children,
  ...props
}) {
  return (
    <ShadcnTabsList {...props} className={cn("", className)}>
      {children}
    </ShadcnTabsList>
  );
}

function TabsTrigger({
  className,
  children,
  ...props
}) {
  return (
    <ShadcnTabsTrigger
      className={cn("", className)}
      {...props}>
      {children}
    </ShadcnTabsTrigger>
  );
}

function TabsContent({
  className,
  ...props
}) {
  return <ShadcnTabsContent className={cn("", className)} {...props} />;
}

export { Tabs, TabsList, TabsContent, TabsTrigger }
