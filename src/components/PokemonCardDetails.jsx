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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";

import { useGetPokemonLocationEncounters } from "@/hooks/useGetPokemonLocationEncounters";
import { useGetPokemonEvolutionChain } from "@/hooks/useGetPokemonEvolutionChain";
import { useGetPokemonAbilities } from "@/hooks/useGetPokemonAbilities";
import computeStatPercentage from "@/utils/computeStatPercentage";
import computeHeightWeightSI from "@/utils/computeHeightWeightSI";
import statMapper from "@/utils/statMapper";
import imageNameMapper from "@/utils/imageNameMapper";

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
    const hasMore = scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5;
    setChevron(hasMore);
  };

  useEffect(() => {
    const leftElement = leftCardRef.current;
    const rightElement = rightCardRef.current;

    checkScrollable(leftElement, setShowLeftChevron);
    checkScrollable(rightElement, setShowRightChevron);

    const handleLeftScroll = () => checkScrollable(leftElement, setShowLeftChevron);
    const handleRightScroll = () => checkScrollable(rightElement, setShowRightChevron);

    if (leftElement) {
      leftElement.addEventListener('scroll', handleLeftScroll);
    }
    if (rightElement) {
      rightElement.addEventListener('scroll', handleRightScroll);
    }

    return () => {
      if (leftElement) {
        leftElement.removeEventListener('scroll', handleLeftScroll);
      }
      if (rightElement) {
        rightElement.removeEventListener('scroll', handleRightScroll);
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="evolution">Evolution</TabsTrigger>
        <TabsTrigger value="location">Locations</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Types Section - Left column with rows */}
          <Card className="flex flex-col h-64 relative">
            <CardContent className="pt-0 flex flex-col h-full">
              <div 
                ref={leftCardRef}
                className="flex flex-col space-y-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {/* Types Row */}
                <div>
                  <h3 className="text-sm font-bold mb-2">Types</h3>
                  <div className="flex flex-row gap-3">
                    {pokemon.types.map((type) => (
                      <PokemonType key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Weaknesses Row */}
                <div>
                  <h3 className="text-sm font-bold mb-2">Weaknesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((weakness) => (
                        <PokemonType
                          key={weakness.type}
                          type={weakness.type}
                          damage={weakness.damage}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-2xl font-bold">
                        N/A
                      </p>
                    )}
                  </div>
                </div>

                {/* Immunities Row */}
                <div>
                  <h3 className="text-sm font-bold mb-2">Immunities</h3>
                  <div className="flex flex-wrap gap-2">
                    {immunities.length > 0 ? (
                      immunities.map((immunity) => (
                        <PokemonType
                          key={immunity.type}
                          type={immunity.type}
                          damage={immunity.damage}
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground text-2xl font-bold px-1">
                        N/A
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {showLeftChevron && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column - Abilities */}
          <Card className="flex flex-col h-64 relative">
            <CardContent className="pt-0 flex flex-col h-full">
              <CardTitle className="text-md font-bold text-center mb-3">
                Abilities
              </CardTitle>
              <div 
                ref={rightCardRef}
                className="flex flex-col space-y-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {abilities && abilities.length > 0 ? (
                  abilities.map((ability, index) => (
                    <div
                      key={index}
                      className={`p-2 bg-muted rounded-none border-2 border-foreground ${
                        ability.hidden ? "bg-yellow-200 text-black" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs capitalize">
                          {ability.name.replace("-", " ")}
                        </span>
                        {ability.hidden && <EyeOff className="w-4 h-4" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {ability.description}
                      </p>
                    </div>
                  ))
                ) : isFetchingAbilities ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground text-xl">
                      Loading abilities...
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground text-xl">
                      No abilities found
                    </p>
                  </div>
                )}
              </div>
              {showRightChevron && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <ChevronDown className="w-4 h-4 text-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Base Stats Section - Full width bottom */}
        <Card>
          <CardContent className="pt-0">
            <CardTitle className="text-lg font-bold text-center mb-4">
              Base Stats
            </CardTitle>
            <div className="grid grid-cols-3 gap-4">
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
        <Card className="flex flex-col h-64">
          <CardContent className="pt-0 flex flex-col h-full">
            <div className="flex flex-col items-center space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                      className="flex flex-col items-center"
                    >
                      {/* Evolution Stage */}
                      <div className="w-full max-w-xs mx-auto">
                        <div className="w-full px-4">
                          <Carousel className="w-full">
                            <CarouselContent>
                              {images.map(({ imageName, imageUrl }, index) => (
                                <CarouselItem key={index}>
                                  <div className="flex flex-col items-center">
                                    <div className="text-center w-full bg-red-400/50">
                                      <p className="text-xs font-bold text-foreground px-2 border-x-2 border-t-2 border-foreground rounded-none font-brand">
                                        {imageName || "Unknown"}
                                      </p>
                                    </div>
                                    <div
                                      className="relative flex justify-center items-center py-2 bg-cover bg-center rounded-lg border-2 border-black mb-2 h-32 w-full"
                                      style={{
                                        backgroundImage: `url('/src/assets/card_background.png')`,
                                      }}
                                    >
                                      {!imageUrl ? (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                          <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold">
                                              ?
                                            </span>
                                          </div>
                                          <span className="text-xs mt-1">
                                            No Image
                                          </span>
                                        </div>
                                      ) : (
                                        <img
                                          src={imageUrl}
                                          alt={evolutionPokemon.name}
                                          className="relative z-20 max-w-24 max-h-24 object-contain"
                                          loading="lazy"
                                        />
                                      )}
                                    </div>

                                    {/* Pokemon name and ID */}
                                    <div className="text-center w-full bg-white">
                                      <p className="text-xs font-bold text-foreground px-2 border-2 border-foreground rounded-none font-brand capitalize">
                                        {evolutionPokemon.name} #
                                        {evolutionPokemon.id}
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
                      </div>

                      {/* Arrow pointing to next evolution (except for last one) */}
                      {index < evolutionChain.length - 1 && (
                        <div className="flex flex-col items-center">
                          <div className="text-2xl">↓</div>
                          <span className="text-muted-foreground">
                            Evolves to
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : isFetchingEvolutionChain ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-xl">
                    Loading evolution chain...
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-xl">
                    No evolution chain found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="location" className="space-y-4">
        <Card className="flex flex-col h-64">
          <CardContent className="pt-0 flex flex-col h-full">
            <div className="flex flex-col items-center space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {locationEncounters && locationEncounters.length > 0 ? (
                locationEncounters.map((location, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 w-full rounded-none bg-muted text-sm font-medium text-foreground shadow-sm border border-border flex flex-row items-center gap-2"
                  >
                    <MapPin fill="white" color="red" className="w-4 h-4" />
                    {location}
                  </div>
                ))
              ) : isFetchingLocationEncounters ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-xl">
                    Loading location encounters...
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground text-xl">
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
