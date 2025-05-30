import { memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/8bit/card";
import { Skeleton } from "@/components/ui/skeleton";

const PokemonCardSkeleton = memo(() => {
  return (
    <div className="group cursor-pointer h-full">
      <Card className="relative overflow-hidden h-full flex flex-col">
        <CardHeader className="flex-shrink-0 h-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-1 w-full">
            <Skeleton className="h-4 w-24 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow px-3">
          <div className="relative flex justify-center items-center py-2 rounded-lg border-2 border-black mb-2 h-20 flex-shrink-0 bg-muted/50">
            <Skeleton className="w-16 h-16 rounded-none" />
          </div>

          <div className="flex flex-row items-center justify-center gap-3 rounded-lg border-2 border-black bg-white/80 py-1 mb-2 h-8 flex-shrink-0">
            <Skeleton className="h-3 w-12 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
          </div>

          <div className="flex flex-row items-center justify-center gap-3 mb-2 h-8 flex-shrink-0">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>

          <div className="flex flex-col items-center justify-center flex-grow min-h-0">
            <div className="grid grid-cols-2 gap-1 w-full h-full">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center justify-center gap-1">
                  <Skeleton className="h-3 w-16 rounded-none" />
                  <Skeleton className="h-2 w-full rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="items-center justify-center gap-2 flex-shrink-0 h-12 mt-auto">
          <Skeleton className="h-8 w-20 rounded-none" />
        </CardFooter>

        <div className="absolute top-2 left-2 w-2 h-2 bg-muted/40" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-muted/40" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-muted/40" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-muted/40" />
      </Card>
    </div>
  );
});

PokemonCardSkeleton.displayName = "PokemonCardSkeleton";

export default PokemonCardSkeleton; 