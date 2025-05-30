import * as React from "react"
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/8bit/button"

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

const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn(orientation === "horizontal"
        ? "top-1/2 -left-6 -translate-y-1/2 w-4 h-8"
        : "-top-6 left-1/2 -translate-x-1/2 rotate-90 w-4 h-8", 
        "absolute bg-black text-white border border-foreground cursor-pointer", 
        "flex items-center justify-center hover:bg-gray-800 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !canScrollPrev && "opacity-50 cursor-not-allowed",
        className)}
      onClick={canScrollPrev ? scrollPrev : undefined}
      {...props}>
      <p className="text-sm font-bold leading-none">{"<"}</p>
      <span className="sr-only">Previous slide</span>
    </div>
  );
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn(orientation === "horizontal"
        ? "top-1/2 -right-6 -translate-y-1/2 w-4 h-8"
        : "-bottom-6 left-1/2 -translate-x-1/2 rotate-90 w-4 h-8", 
        "absolute bg-black text-white border border-foreground cursor-pointer", 
        "flex items-center justify-center hover:bg-gray-800 transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !canScrollNext && "opacity-50 cursor-not-allowed",
        className)}
      onClick={canScrollNext ? scrollNext : undefined}
      {...props}>
      <p className="text-sm font-bold leading-none">{">"}</p>
      <span className="sr-only">Next slide</span>
    </div>
  );
})
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
