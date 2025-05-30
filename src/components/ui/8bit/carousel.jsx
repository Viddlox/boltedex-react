import * as React from "react"
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef((
  {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
  },
  ref
) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  }, plugins)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    console.log("scrolled prev")
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    console.log("scrolled next")
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }, [scrollPrev, scrollNext])

  React.useEffect(() => {
    if (!api || !setApi) {
      return
    }

    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) {
      return
    }

    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    };
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}>
      <div
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props} />
    </div>
  );
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props} />
  );
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(orientation === "horizontal"
        ? "top-1/2 -left-10 md:-left-14 -translate-y-1/2 active:-translate-y-1 w-8 h-9 md:w-9 md:h-10 "
        : "-top-12 left-1/2 -translate-x-1/2 rotate-90 w-8 h-10 md:w-9 md:h-11", "absolute rounded-none aspect-square grid place-items-center", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 256 256"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="0.25"
        color="currentColor"
        aria-label="arrow-left">
        <rect x="64" y="120" width="14" height="14" rx="1"></rect>
        <rect x="96" y="120" width="14" height="14" rx="1"></rect>
        <rect x="80" y="120" width="14" height="14" rx="1"></rect>
        <rect x="112" y="120" width="14" height="14" rx="1"></rect>
        <rect x="144" y="120" width="14" height="14" rx="1"></rect>
        <rect x="160" y="120" width="14" height="14" rx="1"></rect>
        <rect x="80" y="104" width="14" height="14" rx="1"></rect>
        <rect x="96" y="88" width="14" height="14" rx="1"></rect>
        <rect x="112" y="72" width="14" height="14" rx="1"></rect>
        <rect x="80" y="136" width="14" height="14" rx="1"></rect>
        <rect x="96" y="152" width="14" height="14" rx="1"></rect>
        <rect x="112" y="168" width="14" height="14" rx="1"></rect>
        <rect x="176" y="120" width="14" height="14" rx="1"></rect>
        <rect x="128" y="120" width="14" height="14" rx="1"></rect>
      </svg>
      <span className="sr-only">Previous slide</span>
    </Button>
  );
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(orientation === "horizontal"
        ? "top-1/2 -right-10 md:-right-14 -translate-y-1/2 active:-translate-y-1 aspect-square shrink-0 w-8 h-9 md:w-9 md:h-10 "
        : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90 w-8 h-10 md:w-9 md:h-11", "absolute rounded-none aspect-square grid place-items-center", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 256 256"
        fill="currentColor"
        className="block"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="0.25"
        color="currentColor"
        aria-label="arrow-right">
        <rect x="64" y="120" width="14" height="14" rx="1"></rect>
        <rect x="96" y="120" width="14" height="14" rx="1"></rect>
        <rect x="80" y="120" width="14" height="14" rx="1"></rect>
        <rect x="112" y="120" width="14" height="14" rx="1"></rect>
        <rect x="144" y="120" width="14" height="14" rx="1"></rect>
        <rect x="160" y="120" width="14" height="14" rx="1"></rect>
        <rect x="160" y="136" width="14" height="14" rx="1"></rect>
        <rect x="144" y="152" width="14" height="14" rx="1"></rect>
        <rect x="128" y="72" width="14" height="14" rx="1"></rect>
        <rect x="128" y="168" width="14" height="14" rx="1"></rect>
        <rect x="176" y="120" width="14" height="14" rx="1"></rect>
        <rect x="160" y="104" width="14" height="14" rx="1"></rect>
        <rect x="144" y="88" width="14" height="14" rx="1"></rect>
        <rect x="128" y="120" width="14" height="14" rx="1"></rect>
      </svg>
      <span className="sr-only">Next slide</span>
    </Button>
  );
})
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
