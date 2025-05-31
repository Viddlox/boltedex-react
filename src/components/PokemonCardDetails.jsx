import { useMemo, useState, useEffect, useRef } from "react";
import { EyeOff, ChevronDown, MapPin } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/8bit/tabs";
import { PokemonType, StatBar } from "@/components/PokemonCard";
import { Card, CardContent, CardTitle } from "@/components/ui/8bit/card";

import { useGetPokemonLocationEncounters } from "@/hooks/useGetPokemonLocationEncounters";
import { useGetPokemonEvolutionChain } from "@/hooks/useGetPokemonEvolutionChain";
import { useGetPokemonAbilities } from "@/hooks/useGetPokemonAbilities";
import computeStatPercentage from "@/utils/computeStatPercentage";
import computeHeightWeightSI from "@/utils/computeHeightWeightSI";
import statMapper from "@/utils/statMapper";
import imageNameMapper from "@/utils/imageNameMapper";
import getCardBackgroundByType from "@/utils/cardBackgrounds";

const PokemonCardDetails = ({ pokemon }) => {
  const { data: abilities, isFetching: isFetchingAbilities } =
    useGetPokemonAbilities({ name: pokemon.name });
  const { data: evolutionChain, isFetching: isFetchingEvolutionChain } =
    useGetPokemonEvolutionChain({
      name: pokemon.name,
    });
  const { data: locationEncounters, isFetching: isFetchingLocationEncounters } =
    useGetPokemonLocationEncounters({
      name: pokemon.name,
    });
  const backgroundImage = getCardBackgroundByType(pokemon.types);

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

  const weaknesses = useMemo(
    () =>
      Object.entries(pokemon.weaknesses)
        .map(([key, value]) => {
          return {
            type: key,
            damage: value,
          };
        })
        .sort((a, b) => a.damage - b.damage),
    [pokemon.weaknesses]
  );

  const immunities = useMemo(
    () =>
      Object.entries(pokemon.immunities)
        .map(([key, value]) => {
          return {
            type: key,
            damage: value,
          };
        })
        .sort((a, b) => a.damage - b.damage),
    [pokemon.immunities]
  );

  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);

  const checkScrollable = (element, setChevron) => {
    if (!element) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const hasMore =
      scrollHeight > clientHeight &&
      scrollTop + clientHeight < scrollHeight - 5;
    setChevron(hasMore);
  };

  useEffect(() => {
    const leftElement = leftCardRef.current;
    const rightElement = rightCardRef.current;

    checkScrollable(leftElement, setShowLeftChevron);
    checkScrollable(rightElement, setShowRightChevron);

    const handleLeftScroll = () =>
      checkScrollable(leftElement, setShowLeftChevron);
    const handleRightScroll = () =>
      checkScrollable(rightElement, setShowRightChevron);

    if (leftElement) {
      leftElement.addEventListener("scroll", handleLeftScroll);
    }
    if (rightElement) {
      rightElement.addEventListener("scroll", handleRightScroll);
    }

    return () => {
      if (leftElement) {
        leftElement.removeEventListener("scroll", handleLeftScroll);
      }
      if (rightElement) {
        rightElement.removeEventListener("scroll", handleRightScroll);
      }
    };
  }, [pokemon, weaknesses, immunities, abilities]);

  return (
    <Tabs
      defaultValue="overview"
      className="w-full"
      variant="retro"
      font="retro"
    >
      <TabsList className="grid w-full grid-cols-3 h-6 sm:h-auto text-lg font-bold font-brand">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="evolution">Evolution</TabsTrigger>
        <TabsTrigger value="location">Locations</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Types Section - Left column with rows */}
          <Card className="flex flex-col h-48 md:h-64 relative bg-gray-200">
            <CardContent className="pt-0 flex flex-col h-full">
              <div
                ref={leftCardRef}
                className="flex flex-col space-y-1 md:space-y-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {/* Types Row */}
                <div>
                  <h3 className="text-lg font-bold mb-1 md:mb-2">Types</h3>
                  <div className="flex flex-row gap-2 md:gap-3">
                    {pokemon.types.map((type) => (
                      <PokemonType key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Weaknesses Row */}
                <div>
                  <h3 className="text-lg font-bold mb-1 md:mb-2">Weaknesses</h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((weakness) => (
                        <PokemonType
                          key={weakness.type}
                          type={weakness.type}
                          damage={weakness.damage}
                        />
                      ))
                    ) : (
                      <div className="flex flex-row ml-1 items-center justify-center">
                        <p className="text-muted-foreground text-xl font-bold px-1">
                          N/A
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Immunities Row */}
                <div>
                  <h3 className="text-lg font-bold mb-1 md:mb-2">Immunities</h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {immunities.length > 0 ? (
                      immunities.map((immunity) => (
                        <PokemonType
                          key={immunity.type}
                          type={immunity.type}
                          damage={immunity.damage}
                        />
                      ))
                    ) : (
                      <div className="flex flex-row ml-1 items-center justify-center">
                        <p className="text-muted-foreground text-xl font-bold px-1">
                          N/A
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {showLeftChevron && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-black" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column - Abilities */}
          <Card className="flex flex-col h-48 md:h-64 relative bg-gray-200">
            <CardContent className="pt-0 flex flex-col h-full">
              <CardTitle className="text-lg font-bold text-center mb-2 md:mb-3">
                Abilities
              </CardTitle>
              <div
                ref={rightCardRef}
                className="flex flex-col space-y-1 md:space-y-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {abilities && abilities.length > 0 ? (
                  abilities.map((ability, index) => (
                    <div
                      key={index}
                      className={`p-1.5 md:p-2 bg-white/80 rounded-none border-2 border-foreground ${
                        ability.hidden ? "bg-yellow-200 text-black" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm capitalize">
                          {ability.name.replace("-", " ")}
                        </span>
                        {ability.hidden && (
                          <EyeOff className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {ability.description}
                      </p>
                    </div>
                  ))
                ) : isFetchingAbilities ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm md:text-xl">
                      Loading abilities...
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm md:text-xl">
                      No abilities found
                    </p>
                  </div>
                )}
              </div>
              {showRightChevron && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <ChevronDown className="w-4 h-4 text-black" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Base Stats Section - Full width bottom */}
        <Card className="bg-gray-200">
          <CardContent className="pt-0">
            <CardTitle className="text-lg font-bold text-center mb-2 md:mb-4">
              Base Stats
            </CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="evolution" className="space-y-4">
        <Card className="flex flex-col h-48 md:h-64 bg-gray-200">
          <CardContent className="pt-0 flex flex-col h-full">
            <div className="flex flex-col items-center space-y-3 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {evolutionChain && evolutionChain.length > 1 ? (
                evolutionChain.map((evolutionPokemon, index) => {
                  // Transform sprites into the format expected by CarouselPokemon
                  const images = Object.entries(evolutionPokemon.sprites)
                    .map(([key, value]) => {
                      if (value) {
                        return {
                          imageName: imageNameMapper[key],
                          imageUrl: value,
                        };
                      }
                      return null;
                    })
                    .filter(Boolean); // Filter out null/undefined values

                  return (
                    <div
                      key={evolutionPokemon.id}
                      className="flex flex-col items-center w-full"
                    >
                      {/* Evolution Stage */}
                      <div
                        className="relative flex justify-center items-center py-1 md:py-2 bg-cover bg-center rounded-lg border-2 border-black mb-1 md:mb-2 h-24 md:h-32 w-full"
                        style={{
                          backgroundImage: `url(${backgroundImage})`,
                        }}
                      >
                        <img
                          src={images[0].imageUrl}
                          alt={evolutionPokemon.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex flex-row items-center justify-center bg-white w-full border-2 border-black">
                        <span className="text-xl text-black font-bold capitalize text-center ">
                          {evolutionPokemon.name}{" "}
                          <span className="text-lg text-muted-foreground">
                            #{evolutionPokemon.id}
                          </span>
                        </span>
                      </div>
                      {/* Arrow pointing to next evolution (except for last one) */}
                      {index < evolutionChain.length - 1 && (
                        <div className="flex flex-col items-center">
                          <span className="text-xl text-black font-bold text-shadow-sm mt-2">
                            Evolves to
                          </span>
                          <ChevronDown className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : isFetchingEvolutionChain ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm md:text-xl">
                    Loading evolution chain...
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm md:text-xl">
                    No evolution chain found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="location" className="space-y-4">
        <Card className="flex flex-col h-48 md:h-64 bg-gray-200">
          <CardContent className="pt-0 flex flex-col h-full">
            <div className="flex flex-col items-center space-y-3 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {locationEncounters && locationEncounters.length > 0 ? (
                locationEncounters.map((location, index) => (
                  <div
                    key={index}
                    className="px-2 md:px-3 py-1.5 md:py-2 w-full rounded-none bg-muted text-xs md:text-sm font-medium text-foreground shadow-sm border border-foreground/50 flex flex-row items-center gap-1 md:gap-2"
                  >
                    <MapPin
                      fill="white"
                      color="red"
                      className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0"
                    />
                    <span className="truncate">{location}</span>
                  </div>
                ))
              ) : isFetchingLocationEncounters ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm md:text-xl">
                    Loading location encounters...
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm md:text-xl">
                    No location encounters found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PokemonCardDetails;
