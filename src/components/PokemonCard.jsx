import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/8bit/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/8bit/hover-card";
import { Progress } from "@/components/ui/8bit/progress";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/8bit/carousel";
import PokemonCardDetails from "@/components/PokemonCardDetails";
import PokemonCardImageBackground from "@/components/PokemonCardImageBackground";

import pokemonTypeMapper from "@/utils/pokemonTypeMapper";
import computeStatPercentage from "@/utils/computeStatPercentage";
import computeHeightWeightSI from "@/utils/computeHeightWeightSI";
import statMapper from "@/utils/statMapper";
import imageNameMapper from "@/utils/imageNameMapper";

import { useQueryClient } from "@tanstack/react-query";

export const PokemonType = memo(({ type, damage }) => (
  <HoverCard>
    <HoverCardTrigger className="hover:scale-110 transition-all duration-300">
      <img
        src={pokemonTypeMapper[type].src}
        alt={type}
        className={`w-6 h-6 p-0.5 ${pokemonTypeMapper[type].color} rounded-full border-2 border-black`}
        loading="lazy"
      />
    </HoverCardTrigger>
    <HoverCardContent
      className={`w-fit h-8 py-1 px-2 backdrop-blur-sm rounded-lg ${pokemonTypeMapper[type].color}`}
    >
      <p>
        {type} {damage && `(${damage}x)`}
      </p>
    </HoverCardContent>
  </HoverCard>
));

export const StatBar = memo(({ stat, value, percentage }) => (
  <div className="flex flex-col items-center justify-center gap-1">
    <p className="text-xs font-semibold text-center">
      {stat} ({value})
    </p>
    <Progress variant="retro" value={percentage} />
  </div>
));

export const CarouselPokemon = memo(
  ({
    pokemon,
    images,
    imageLoaded = false,
    setImageLoaded = () => {},
    height = null,
    weight = null,
  }) => {
    return (
      <div className="max-w-[55vw] sm:max-w-sm mx-auto px-0 sm:px-6 mb-2">
        <Carousel>
          <CarouselContent>
            {images.map(({ imageName, imageUrl }, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center">
                  <div className="text-center w-full bg-red-400/50">
                    <p className="text-xs font-bold text-foreground px-1 sm:px-3 border-x-2 border-t-2 border-foreground rounded-none font-brand">
                      {imageName || "Unknown"}
                    </p>
                  </div>
                  <PokemonCardImageBackground
                    types={pokemon.types}
                    className="relative flex justify-center items-center py-1 sm:py-2 bg-cover bg-center rounded-lg border-2 border-black h-24 sm:h-40 flex-shrink-0 w-full"
                  >
                    {!imageLoaded && imageUrl && (
                      <Loader2
                        color="red"
                        className="w-8 h-8 sm:w-16 sm:h-16 animate-spin"
                      />
                    )}

                    {!imageUrl ? (
                      // Show placeholder when no image is available
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-6 h-6 sm:w-12 sm:h-12 border border-dashed sm:border-2 border-gray-300 rounded sm:rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold">?</span>
                        </div>
                        <span className="text-xs mt-1">No Image</span>
                      </div>
                    ) : (
                      <img
                        src={imageUrl}
                        alt={pokemon.name}
                        className={`relative z-20 h-full w-full object-contain transition-opacity duration-200 ${
                          imageLoaded ? "opacity-100" : "opacity-0 h-0 w-0"
                        }`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                      />
                    )}
                  </PokemonCardImageBackground>
                  <div className="text-center w-full bg-white">
                    <p className="text-xs sm:text-sm font-bold text-foreground px-1 sm:px-3 border-b-2 border-x-2 border-foreground rounded-none font-brand">
                      {height} {weight}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  }
);

const PokemonCard = memo(({ pokemon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState(pokemon);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handlePreloadPokemon = async () => {
      await queryClient.setQueryData(["pokemon", pokemon.name], pokemon);
    };
    handlePreloadPokemon();
  }, [pokemon, queryClient]);

  const imageUrl = useMemo(() => {
    const validSprites = Object.entries(pokemon.sprites).map(([key, value]) => {
      if (value) {
        return {
          imageName: imageNameMapper[key],
          imageUrl: value,
        };
      }
      return null;
    }).filter(Boolean);
    
    return validSprites.length > 0 ? validSprites[0].imageUrl : null;
  }, [pokemon.sprites]);

  const carouselImageUrls = useMemo(() => {
    const validSprites = Object.entries(currentPokemon.sprites).map(([key, value]) => {
      if (value) {
        return {
          imageName: imageNameMapper[key],
          imageUrl: value,
        };
      }
      return null;
    }).filter(Boolean);
    
    return validSprites;
  }, [currentPokemon.sprites]);

  useEffect(() => {
    if (!imageUrl) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [imageUrl]);

  const computedData = useMemo(() => {
    const pokemonStatPercentages = computeStatPercentage(pokemon.baseStats);
    const { height, weight } = computeHeightWeightSI(
      pokemon.height,
      pokemon.weight
    );

    return {
      pokemonStatPercentages,
      height,
      weight,
    };
  }, [pokemon]);

  const modalComputedData = useMemo(() => {
    const pokemonStatPercentages = computeStatPercentage(
      currentPokemon.baseStats
    );
    const { height, weight } = computeHeightWeightSI(
      currentPokemon.height,
      currentPokemon.weight
    );

    return {
      pokemonStatPercentages,
      height,
      weight,
    };
  }, [currentPokemon]);

  const shouldReduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const handleCardClick = () => {
    setIsModalOpen(true);
    setCurrentPokemon(pokemon);
  };

  const cardVariants = {
    hover: shouldReduceMotion ? {} : { scale: 1.02 },
    tap: shouldReduceMotion ? {} : { scale: 0.98 },
  };

  const imageVariants = {
    hover: shouldReduceMotion
      ? {}
      : {
          y: [-2, -8, -2],
          rotate: [0, -2, 2, 0],
        },
  };

  return (
    <>
      <motion.div
        className="group cursor-pointer h-full"
        variants={cardVariants}
        whileHover="hover"
        transition={
          shouldReduceMotion
            ? {}
            : {
                type: "spring",
                stiffness: 300,
                damping: 20,
              }
        }
      >
        <Card className="relative overflow-hidden transition-all duration-300 hover:border-red-400 h-full flex flex-col max-w-xs sm:max-w-sm mx-auto">
          {!shouldReduceMotion && (
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-red-400/20 via-lime-300/30 to-red-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ zIndex: -1 }}
            />
          )}

          <CardHeader className="flex-shrink-0 h-2 flex items-center justify-center">
            <CardTitle className="card-title text-xl font-bold capitalize text-center group-hover:text-red-600 transition-colors duration-300 line-clamp-2 leading-tight">
              {pokemon.name}{" "}
              <span className="text-lg text-muted-foreground group-hover:text-red-600 transition-colors duration-300">
                #{pokemon.id}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col flex-grow px-3">
            <PokemonCardImageBackground
              types={pokemon.types}
              className={`relative flex justify-center items-center py-2 bg-cover bg-center rounded-lg border-2 border-black mb-2 h-20 flex-shrink-0`}
            >
              {!imageLoaded && imageUrl && (
                <Loader2 color="red" className="w-16 h-16 animate-spin" />
              )}

              {!imageUrl ? (
                // Show placeholder when no image is available
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold">?</span>
                  </div>
                  <span className="text-xs mt-1">No Image</span>
                </div>
              ) : (
                <motion.img
                  src={imageUrl}
                  alt={pokemon.name}
                  className={`relative z-20 group-hover:drop-shadow-lg group-hover:drop-shadow-red-400/50 max-w-16 max-h-16 object-contain transition-opacity duration-200 ${
                    imageLoaded ? "opacity-100" : "opacity-0 h-0 w-0"
                  }`}
                  variants={imageVariants}
                  whileHover="hover"
                  transition={
                    shouldReduceMotion
                      ? {}
                      : {
                          duration: 0.6,
                          ease: "easeInOut",
                          times: [0, 0.5, 1],
                        }
                  }
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              )}
            </PokemonCardImageBackground>

            <div className="flex flex-row items-center text-sm justify-center gap-3 rounded-lg border-2 border-black bg-white/80 mb-2 h-5 flex-shrink-0">
              <p>{computedData.height}</p>
              <p>{computedData.weight}</p>
            </div>

            <div className="flex flex-row items-center justify-center gap-3 mb-2 h-8 flex-shrink-0">
              {pokemon.types.map((type) => (
                <PokemonType key={type} type={type} />
              ))}
            </div>

            <div className="flex flex-col items-center justify-center flex-grow min-h-0">
              <div className="grid grid-cols-2 gap-3 w-4/5 h-full">
                {Object.entries(computedData.pokemonStatPercentages).map(
                  ([stat, percentage]) => (
                    <StatBar
                      key={stat}
                      stat={stat}
                      value={pokemon.baseStats[statMapper[stat]]}
                      percentage={percentage}
                    />
                  )
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="items-center justify-center gap-2 flex-shrink-0 h-8 mt-auto">
            <CardAction>
              <Button
                onClick={handleCardClick}
                variant="secondary"
                size="xs"
                font="retro"
                className="group-hover:shadow-lg group-hover:shadow-red-400/30 transition-all duration-300 h-8 text-xs px-2 hover:scale-105"
              >
                View more
              </Button>
            </CardAction>
          </CardFooter>

          <div className="absolute top-2 left-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Card>
      </motion.div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[80vw] sm:max-w-[425px] max-h-[70vh] sm:max-h-[80vh] [&>button]:hidden p-2 sm:p-6 flex flex-col">
          <DialogHeader className="pb-2 sm:pb-4 flex-shrink-0">
            <DialogTitle className="capitalize text-center text-xl sm:text-2xl">
              {currentPokemon.name} #{currentPokemon.id}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 sm:px-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CarouselPokemon
              pokemon={currentPokemon}
              images={carouselImageUrls}
              imageLoaded={imageLoaded}
              setImageLoaded={setImageLoaded}
              height={modalComputedData.height}
              weight={modalComputedData.weight}
            />
            <PokemonCardDetails
              currentPokemon={currentPokemon}
              setCurrentPokemon={setCurrentPokemon}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

PokemonCard.displayName = "PokemonCard";
PokemonType.displayName = "PokemonType";
StatBar.displayName = "StatBar";

export default PokemonCard;
