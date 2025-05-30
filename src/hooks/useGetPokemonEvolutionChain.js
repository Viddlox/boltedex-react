import { useQuery } from "@tanstack/react-query";
import getPokemonEvolutionChain from "@/services/request-config/getPokemonEvolutionChain";

export const useGetPokemonEvolutionChain = (name) => {
  return useQuery({
    queryKey: ["pokemon-evolution-chain", name],
    queryFn: () => getPokemonEvolutionChain(name),
  });
};
