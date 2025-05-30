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
import pokemonTypeMapper from "@/utils/pokemonTypeMapper";
import computeStatPercentage from "@/utils/computeStatPercentage";
import computeHeightWeightSI from "@/utils/computeHeightWeightSI";
import statMapper from "@/utils/statMapper";
import imageNameMapper from "@/utils/imageNameMapper";

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
    id = null,
  }) => {
    return (
      <div className="w-full max-w-sm mx-auto px-8">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map(({ imageName, imageUrl }, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center">
                  <div className="text-center w-full bg-red-400/50">
                    <p className="text-sm font-bold text-foreground px-3 border-x-2 border-t-2 border-foreground rounded-none font-brand">
                      {imageName || "Unknown"}
                    </p>
                  </div>
                  <div
                    className="relative flex justify-center items-center py-2 bg-cover bg-center rounded-lg border-2 border-black mb-2 h-40 flex-shrink-0 mx-auto w-full max-w-sm"
                    style={{
                      backgroundImage: `url('/src/assets/card_background.png')`,
                    }}
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
                      <img
                        src={imageUrl}
                        alt={pokemon.name}
                        className={`relative z-20 max-w-32 max-h-32 object-contain transition-opacity duration-200 ${
                          imageLoaded ? "opacity-100" : "opacity-0 h-0 w-0"
                        }`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                      />
                    )}
                  </div>

                  {height && weight && (
                    <div className="text-center w-full bg-white">
                      <p className="text-sm font-bold text-foreground px-3 border-2 border-foreground rounded-none font-brand">
                        {height} {weight}
                      </p>
                    </div>
                  )}
                  {id && (
                    <div className="text-center w-full bg-white">
                      <p className="text-sm font-bold text-foreground px-3 border-2 border-foreground rounded-none font-brand">
                        #{id}
                      </p>
                    </div>
                  )}
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

  const imageUrls = useMemo(() => {
    return Object.entries(pokemon.sprites).map(([key, value]) => {
      if (value) {
        return {
          imageName: imageNameMapper[key],
          imageUrl: value,
        };
      }
      return null;
    });
  }, [pokemon.sprites]).filter(Boolean);

  const imageUrl = useMemo(() => {
    return imageUrls[0]?.imageUrl || null;
  }, [imageUrls]);

  // Set imageLoaded to true immediately if there's no image to load
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
  }, [pokemon.baseStats, pokemon.height, pokemon.weight]);

  const shouldReduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const handleCardClick = () => {
    setIsModalOpen(true);
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
        whileTap="tap"
        transition={
          shouldReduceMotion
            ? {}
            : {
                type: "spring",
                stiffness: 300,
                damping: 20,
              }
        }
        onClick={handleCardClick}
      >
        <Card className="relative overflow-hidden transition-all duration-300 hover:border-red-400 h-full flex flex-col">
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
            <div
              className="relative flex justify-center items-center py-2 bg-cover bg-center rounded-lg border-2 border-black mb-2 h-20 flex-shrink-0"
              style={{
                backgroundImage: `url('/src/assets/card_background.png')`,
              }}
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
            </div>

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
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="capitalize text-center">
              {pokemon.name} #{pokemon.id}
            </DialogTitle>
          </DialogHeader>
          <CarouselPokemon
            pokemon={pokemon}
            images={imageUrls}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            height={computedData.height}
            weight={computedData.weight}
          />
          <PokemonCardDetails pokemon={pokemon} />
        </DialogContent>
      </Dialog>
    </>
  );
});

PokemonCard.displayName = "PokemonCard";
PokemonType.displayName = "PokemonType";
StatBar.displayName = "StatBar";

export default PokemonCard;
