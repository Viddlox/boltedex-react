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
import { useGetPokemonDetail } from "@/hooks/useGetPokemonDetail";

import computeStatPercentage from "@/utils/computeStatPercentage";
import statMapper from "@/utils/statMapper";
import imageNameMapper from "@/utils/imageNameMapper";
import PokemonCardImageBackground from "@/components/PokemonCardImageBackground";

const PokemonCardDetails = ({ currentPokemon, setCurrentPokemon }) => {
  const [selectedPokemonName, setSelectedPokemonName] = useState(
    currentPokemon.name
  );

  const { data: pokemonDetail } = useGetPokemonDetail({
    name: selectedPokemonName,
  });
  const { data: abilities, isFetching: isFetchingAbilities } =
    useGetPokemonAbilities({ name: selectedPokemonName });
  const { data: evolutionChain, isFetching: isFetchingEvolutionChain } =
    useGetPokemonEvolutionChain({
      name: selectedPokemonName,
    });
  const { data: locationEncounters, isFetching: isFetchingLocationEncounters } =
    useGetPokemonLocationEncounters({
      name: selectedPokemonName,
    });
  const types = currentPokemon.types;

  const computedData = useMemo(() => {
    const pokemonStatPercentages = computeStatPercentage(
      currentPokemon.baseStats
    );
    return {
      pokemonStatPercentages,
    };
  }, [currentPokemon.baseStats]);

  useEffect(() => {
    if (pokemonDetail) {
      const weaknessesSource = pokemonDetail.weaknesses || {};
      const immunitiesSource = pokemonDetail.immunities || {};

      const weaknesses = Object.entries(weaknessesSource)
        .map(([key, value]) => ({
          type: key,
          damage: value,
        }))
        .sort((a, b) => a.damage - b.damage);

      const immunities = Object.entries(immunitiesSource)
        .map(([key, value]) => ({
          type: key,
          damage: value,
        }))
        .sort((a, b) => a.damage - b.damage);

      setCurrentPokemon({
        ...pokemonDetail,
        weaknesses,
        immunities,
      });
    }
  }, [pokemonDetail, setCurrentPokemon]);

  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const bottomCardRef = useRef(null);

  const [currentCard, setCurrentCard] = useState("overview");
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [showBottomChevron, setShowBottomChevron] = useState(false);

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
    const bottomElement = bottomCardRef.current;

    checkScrollable(leftElement, setShowLeftChevron);
    checkScrollable(rightElement, setShowRightChevron);
    checkScrollable(bottomElement, setShowBottomChevron);

    const handleLeftScroll = () =>
      checkScrollable(leftElement, setShowLeftChevron);
    const handleRightScroll = () =>
      checkScrollable(rightElement, setShowRightChevron);
    const handleBottomScroll = () =>
      checkScrollable(bottomElement, setShowBottomChevron);

    if (leftElement) {
      leftElement.addEventListener("scroll", handleLeftScroll);
    }
    if (rightElement) {
      rightElement.addEventListener("scroll", handleRightScroll);
    }
    if (bottomElement) {
      bottomElement.addEventListener("scroll", handleBottomScroll);
    }

    return () => {
      if (leftElement) {
        leftElement.removeEventListener("scroll", handleLeftScroll);
      }
      if (rightElement) {
        rightElement.removeEventListener("scroll", handleRightScroll);
      }
      if (bottomElement) {
        bottomElement.removeEventListener("scroll", handleBottomScroll);
      }
    };
  }, [
    currentPokemon,
    abilities,
    locationEncounters,
    evolutionChain,
    currentCard,
  ]);

  const handleEvolutionClick = (evolutionPokemon) => {
    if (evolutionPokemon.name !== currentPokemon.name) {
      setSelectedPokemonName(evolutionPokemon.name);
      setCurrentCard("overview");
    }
  };

  return (
    <Tabs
      defaultValue="overview"
      value={currentCard}
      className="w-full"
      variant="retro"
      font="retro"
      onValueChange={(value) => {
        setCurrentCard(value);
      }}
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
                  <h3 className="text-lg font-bold mb-1 md:mb-2 underline">
                    Types
                  </h3>
                  <div className="flex flex-row gap-2 md:gap-3">
                    {currentPokemon.types.map((type) => (
                      <PokemonType key={type} type={type} />
                    ))}
                  </div>
                </div>

                {/* Weaknesses Row */}
                <div>
                  <h3 className="text-lg font-bold mb-1 md:mb-2 underline">
                    Weaknesses
                  </h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {currentPokemon.weaknesses.length > 0 ? (
                      currentPokemon.weaknesses.map((weakness) => (
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
                  <h3 className="text-lg font-bold mb-1 md:mb-2 underline">
                    Immunities
                  </h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {currentPokemon.immunities.length > 0 ? (
                      currentPokemon.immunities.map((immunity) => (
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
                  <ChevronDown className="w-4 h-4 text-black" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right column - Abilities */}
          <Card className="flex flex-col h-48 md:h-64 relative bg-gray-200">
            <CardContent className="pt-0 flex flex-col h-full">
              <CardTitle className="text-lg font-bold text-center mb-2 md:mb-3 underline">
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
                      className={`p-1 md:p-2 bg-white/80 rounded-none border-2 border-foreground ${
                        ability.hidden ? "bg-yellow-200 text-black" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs capitalize underline">
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
            <CardTitle className="text-lg font-bold text-center mb-2 md:mb-4 underline">
              Base Stats
            </CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(computedData.pokemonStatPercentages).map(
                ([stat, percentage]) => (
                  <StatBar
                    key={stat}
                    stat={stat}
                    value={currentPokemon.baseStats[statMapper[stat]]}
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
                    .filter(Boolean);

                  return (
                    <div
                      key={evolutionPokemon.id}
                      className="flex flex-col items-center w-full mt-1"
                    >
                      {/* Evolution Stage */}
                      <PokemonCardImageBackground
                        types={types}
                        className={`relative cursor-pointer flex justify-center items-center py-1 md:py-2 bg-cover bg-center rounded-lg border-2 border-black mb-1 md:mb-2 h-24 md:h-32 w-[80%] mx-auto transition-all duration-200 ease-in-out hover:scale-105 hover:border-red-400 hover:border-2 active:scale-95 transform`}
                        onClick={() => handleEvolutionClick(evolutionPokemon)}
                        onMouseDown={(e) =>
                          (e.currentTarget.style.transform = "scale(0.95)")
                        }
                        onMouseUp={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <img
                          src={images[0].imageUrl}
                          alt={evolutionPokemon.name}
                          className="w-full h-full object-contain"
                        />
                      </PokemonCardImageBackground>

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
            <div
              className="flex flex-col items-center space-y-3 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              ref={bottomCardRef}
            >
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
            {showBottomChevron && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <ChevronDown className="w-4 h-4 text-black" />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PokemonCardDetails;
