import { memo, useMemo, useState } from "react";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/8bit/hover-card";
import { Progress } from "@/components/ui/8bit/progress";

import pokemonTypeMapper from "@/utils/pokemonTypeMapper";
import computeStatPercentage from "@/utils/computeStatPercentage";
import computeHeightWeightSI from "@/utils/computeHeightWeightSI";

// Memoized type component
const PokemonType = memo(({ type }) => (
  <HoverCard>
    <HoverCardTrigger className="hover:scale-110 transition-all duration-300">
      <img
        src={pokemonTypeMapper[type].src}
        alt={type}
        className={`w-6 h-6 p-0.5 ${pokemonTypeMapper[type].color} rounded-full`}
        loading="lazy" // Lazy load type images
      />
    </HoverCardTrigger>
    <HoverCardContent className="w-fit h-8 py-1 px-2 bg-white/80 backdrop-blur-sm rounded-lg">
      <p>{type}</p>
    </HoverCardContent>
  </HoverCard>
));

// Memoized stat component
const StatBar = memo(({ stat, value, percentage }) => (
  <div className="flex flex-col items-center justify-center gap-1">
    <p className="text-xs font-semibold text-center">
      {stat} ({value})
    </p>
    <Progress variant="retro" value={percentage} />
  </div>
));

const PokemonCard = memo(({ pokemon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize expensive computations
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

  // Reduce motion for performance (optional)
  const shouldReduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Simplified animation variants
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
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-red-400/20 hover:border-red-400 h-full flex flex-col">
        {/* Reduced number of animated overlays for performance */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-red-400/20 via-lime-300/30 to-red-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ zIndex: -1 }}
          />
        )}

        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg font-bold capitalize text-center group-hover:text-red-600 transition-colors duration-300">
            {pokemon.name}{" "}
            <span className="text-sm text-muted-foreground group-hover:text-red-600 transition-colors duration-300">
              #{pokemon.id}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-grow">
          {/* Optimized sprite container */}
          <div
            className="relative flex justify-center items-center py-4 bg-cover bg-center rounded-lg border-2 border-black mb-3 h-24"
            style={{
              backgroundImage: `url('/src/assets/card_background.png')`,
            }}
          >
            {/* Placeholder while image loads */}
            {!imageLoaded && (
              <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse" />
            )}

            <motion.img
              src={pokemon.sprites.frontDefault}
              alt={pokemon.name}
              className={`relative z-20 group-hover:drop-shadow-lg group-hover:drop-shadow-red-400/50 max-w-16 max-h-16 object-contain transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
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
              loading="lazy" // Lazy load images
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Show placeholder on error too
            />
          </div>

          {/* Height/Weight info */}
          <div className="flex flex-row items-center justify-center gap-3 rounded-lg border-2 border-black bg-white/80 py-1 mb-3">
            <p className="text-xs font-semibold">{computedData.height}</p>
            <p className="text-xs font-semibold">{computedData.weight}</p>
          </div>

          {/* Types */}
          <div className="flex flex-row items-center justify-center gap-3 mb-3">
            {pokemon.types.map((type) => (
              <PokemonType key={type} type={type} />
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className="grid grid-cols-2 gap-2 w-full">
              {Object.entries(computedData.pokemonStatPercentages).map(
                ([stat, percentage]) => (
                  <StatBar
                    key={stat}
                    stat={stat}
                    value={pokemon.baseStats[stat]}
                    percentage={percentage}
                  />
                )
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="items-center justify-center gap-2 flex-shrink-0 mt-auto">
          <CardAction>
            <Button
              variant="secondary"
              size="xs"
              font="retro"
              className="group-hover:shadow-lg group-hover:shadow-red-400/30 transition-all duration-300 h-8 text-xs"
            >
              View more
            </Button>
          </CardAction>
        </CardFooter>

        {/* Corner indicators - only show on hover to reduce DOM complexity */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
});

PokemonCard.displayName = "PokemonCard";
PokemonType.displayName = "PokemonType";
StatBar.displayName = "StatBar";

export default PokemonCard;
